<template>
  <div class="painting-page">
    <div v-if="painting">
      <h1>{{ painting.name }}</h1>
      <!-- Display all images from imageUrls -->
      <img
        :src="imageUrl"
        :alt="`Image of ${painting.name}`"
        class="painting-image"
      />
      <p>{{ painting.description }}</p>
      <p>
        <strong>Seller: {{ owner.username }}</strong>
      </p>
      <p>
        <strong
          >Email to seller:
          <a :href="`mailto:${owner.email}`">{{ owner.email }}</a></strong
        >
      </p>
      <p>
        <strong>Price: ${{ painting.price }}</strong>
      </p>
      <p>
        <strong>Likes: {{ painting.likes }}</strong>
      </p>
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
      owner: null,
      imageUrl: null, // Store image URL here
    };
  },
  created() {
    this.paintingId = this.$route.params.paintingId;
    fetch(`/api/painting/${this.paintingId}`)
    .then((response => {
      if (!response.ok) {
          throw new Error(
            `Failed to fetch painting data: ${response.statusText}`
          );
        }
        return response.json()
    }))
    .then(async (data) => {
      this.painting = data.painting;
      this.owner = data.owner;

      const imageUrl = await fetch(`/api/images/${this.paintingId}`)
      this.imageUrl = imageUrl
    })
    .catch((error) => {
        console.error("Error fetching painting data and images:", error);
      });
  },
};
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
