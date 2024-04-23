<template>
  <div class="container">
    <form enctype="multipart/form-data">
      <div class="form-group col-md-8 offset-md-2">
        <label for="paintingName">
          <input
            v-model="paintingName"
            type="text"
            class="form-control"
            placeholder="Name of painting"
            required
            @change="handleInputChange"
          />
        </label>
        <label for="price">
          <input
            v-model="paintingPrice"
            type="number"
            class="form-control"
            placeholder="Price"
            min="1"
            step="0.01"
            required
            @change="handleInputChange"
          />
        </label>
        <label for="description">
          <input
            v-model="paintingDescription"
            type="text"
            class="form-control"
            placeholder="Description"
            maxlength="100"
            required
            @change="handleInputChange"
          />
        </label>
        <label for="image">
          <input
            ref="imageInput"
            name="image"
            type="file"
            class="form-control-file"
            accept="image/*"
            required
            @change="handleFileChange"
          />
        </label>
        <div>
          <img v-if="imageURL" :src="imageURL" alt="Preview painting image" />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="uploadPainting"
        >
          Upload painting
        </button>
      </div>
      <div>
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script>
import userDataStore from "../js/stores/authenticated";

export default {
  data() {
    return {
      paintingId: "",
      paintingName: "",
      paintingPrice: "",
      paintingDescription: "",
      image: null,
      imageURL: null,
      blob: null,
      message: "",
      pendingChanges: null,
      saveTimeout: null,
    };
  },
  mounted() {
    // Check if there was any painting the user was publishing
    fetch(`/api/checkPreviousPaintingSession`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("You have no previous painting listing available");
        }
        return response.json();
      })
      .then(async (painting) => {
        // Restore the values
        this.paintingName = painting.name;
        this.paintingPrice = painting.price;
        this.paintingDescription = painting.description;
        this.paintingId = painting.painting_id;
        this.imageURL = `/api/image/${this.paintingId}`; // Fetch the image uploaded previously (if any)

        const file = new File([this.blob], "painting-image.jpg", {
          type: "image/jpeg",
        });
        this.image = file; // Set fetched file object to vue data property
      })
      .catch(() => {
        console.log("You have no previous painting sessions");
      });
  },
  methods: {
    handleFileChange(event) {
      // Store selected file
      if (event.target.files.length > 0) {
        const [file] = event.target.files;
        if (file) {
          this.image = file;
          this.imageURL = URL.createObjectURL(file);
          this.handleInputChange(); // Trigger input change when file changes
        }
      }
    },

    async uploadPainting() {
      const formData = new FormData();
      formData.append("paintingName", this.paintingName);
      formData.append("paintingPrice", this.paintingPrice);
      formData.append("paintingDescription", this.paintingDescription);
      formData.append("image", this.image);

      if (!this.image) {
        this.message =
          "You must upload a picture of the image before uploading it.";
        return;
      }

      if (!this.paintingName) {
        this.message = "You must give the painting a name before uploading it.";
        return;
      }

      if (!this.paintingPrice) {
        this.message =
          "You must give the painting a price before uploading it.";
        return;
      }

      if (!this.paintingDescription) {
        this.message =
          "You must give the painting a description before uploading it.";
        return;
      }

      try {
        const response = await fetch("/api/painting", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Success:", data.message);

        const userstore = userDataStore();
        userstore.socket.emit("paintingsChanged");

        this.resetForm();
        this.resetSaveTimer();
        this.$root.$router.push("/paintings")
      } catch (error) {
        console.error("Error:", error);
      }
    },

    resetForm() {
      this.paintingName = "";
      this.paintingPrice = "";
      this.paintingDescription = "";
      this.image = null;
      this.$refs.imageInput.value = ""; // Clear file input value
    },

    resetSaveTimer() {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
      this.pendingChanges = null;
    },

    handleInputChange() {
      console.log("Change detected");
      console.log("paintingName:", this.paintingName);
      console.log("paintingPrice:", this.paintingPrice);
      console.log("paintingDescription:", this.paintingDescription);
      console.log("image:", this.image);

      this.pendingChanges = new FormData();
      this.pendingChanges.append("paintingName", this.paintingName);
      this.pendingChanges.append("paintingPrice", this.paintingPrice);
      this.pendingChanges.append(
        "paintingDescription",
        this.paintingDescription
      );
      this.pendingChanges.append("image", this.image);

      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(this.saveToDb, 3000);
    },
    async saveToDb() {
      if (this.pendingChanges) {
        try {
          console.log("Saving changes to the database:", this.pendingChanges);
          const response = await fetch("/api/saveChanges", {
            method: "POST",
            body: this.pendingChanges,
          });

          // Handle response if needed
          console.log(response);

          this.resetSaveTimer();
        } catch (error) {
          console.error("Fetch Error:", error);
        }
      }
    },
  },
};
</script>
