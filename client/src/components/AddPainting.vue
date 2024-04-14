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
          />
        </label>
        <label for="image">
          <input
            name="image"
            type="file"
            class="form-control-file"
            accept="image/*"
            required
            @change="handleFileChange"
          />
        </label>
        <button
          type="submit"
          class="btn btn-primary"
          @click.prevent="uploadPainting"
        >
          Upload
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from "pinia";
import paintingStore from "../js/stores/paintings";
import userDataStore from "../js/stores/authenticated";

export default {
  data() {
    return {
      paintingName: "",
      paintingPrice: "",
      image: null,
    };
  },
  methods: {
    ...mapActions(paintingStore, ["updatePaintings", "addPainting", "getPaintings"]),

    handleFileChange(event) {
      // Store selected file
      if (event.target.files.length > 0) {
        this.image = event.target.files[0];
      }
    },
    async uploadPainting() {
      // Create FormData object
      const formData = new FormData();
      formData.append("paintingName", this.paintingName);
      formData.append("paintingPrice", this.paintingPrice);
      formData.append("image", this.image);

      try {
        // Send FormData to backend
        await fetch("/api/painting", {
          method: "POST",
          body: formData,
        }).then(response => response.json())
          .then(data => {
            console.log('Success:', data.message);
            const userstore = userDataStore()
            userstore.socket.emit("paintingsChanged") // Emit change to server

            // Reset form fields
            this.paintingName = "";
            this.paintingPrice = "";
            this.image = null;
          })
          .catch(error => {
            console.error('Error:', error);
          });
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    },
  },
};
</script>