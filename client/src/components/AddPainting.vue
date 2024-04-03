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
            ref="imageInput"
            type="file"
            class="form-control-file"
            multiple
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

export default {
  data() {
    return {
      paintingName: "",
      paintingPrice: "",
      images: [],
      socket: undefined,
    };
  },
  methods: {
    ...mapActions(paintingStore, ["updatePaintings"]),

    handleFileChange(event) {
      // Store selected files
      this.images = event.target.files;
    },
    async uploadPainting() {
      const { socket } = this.$root;
      // Create FormData object
      const formData = new FormData();
      formData.append("painting_name", this.paintingName);
      formData.append("painting_price", this.paintingPrice);

      // Append each selected image to the FormData
      for (let i = 0; i < this.images.length; i += 1) {
        formData.append("images", this.images[i]);
      }

      try {
        // Send FormData to backend
        await fetch("/api/painting", {
          method: "POST",
          body: formData,
        }).then(async (postResponse) => {
          if (postResponse.ok) {
            await fetch("/api/paintings")
              .then((getResponse) => {
                if (getResponse.ok) {
                  return getResponse.json();
                }
                throw new Error("Error sending painting to server");
              })
              .then((paintings) => {
                console.log(paintings);
                socket.emit("paintingsChanged", paintings); // Emit changes

                // Reset form fields
                this.paintingName = "";
                this.paintingPrice = "";
                this.images = [];
              });
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
