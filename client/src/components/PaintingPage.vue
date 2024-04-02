<template>
  <div class="painting-page">
    <div v-if="painting">
      <h1>{{ painting.name }}</h1>
      <!-- Display all images from imageUrls -->
      <img v-for="(url, index) in imageUrls" 
        :src="url" 
        :alt="`Image ${index} of ${painting.name}`" 
        class="painting-image" 
        :key="index">
      <p>{{ painting.description }}</p>
      <p><strong>Price: ${{ painting.price }}</strong></p>
      <p><strong>Likes: {{ painting.likes }}</strong></p>
      <button @click="addToCart">Add to Cart</button>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paintingId: null,
      painting: null,
      imageUrls: [], // Array to store image URLs
    };
  },
  created() {
    this.paintingId = this.$route.params.paintingId;
    Promise.all([
      fetch(`/api/painting/${this.paintingId}`).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch painting data: ${response.statusText}`);
        }
        return response.json();
      }),
      fetch(`/api/painting/images/${this.paintingId}`).then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch painting images: ${response.statusText}`);
        }
        return response.blob(); // Parse the response as Blob
      })
    ]).then(([paintingData, imagesBlob]) => {
      this.painting = paintingData;
      this.processBlob(imagesBlob); // Process the blob data
    }).catch(error => {
      console.error("Error fetching painting data and images:", error);
    });
},
methods: {
    processBlob(blob) {
        const reader = new FileReader();
        reader.onload = () => {
            this.imageUrls.push(reader.result); // Add the result to imageUrls directly
        };
        reader.readAsDataURL(blob); // Read the blob data as a data URL
    }
}
}
</script>

<style scoped>
.painting-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.painting-image {
  max-width: 100%;
}
</style>
