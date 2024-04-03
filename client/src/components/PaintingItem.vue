<template>
  <div class="card">
    <div class="card-header">
      Title: {{ name }}
      <div v-if="username">
        by <strong>{{ username }}</strong>
      </div>
    </div>
    <div class="card-body">
      <router-link :to="'/painting/' + id">
        <img
          :src="getImageDataUrl()"
          alt="Featured image"
          class="card-img-top"
        />
      </router-link>
    </div>
    <div class="card-footer text-body-secondary">
      ${{ price }}
      <button type="button" @click="handleLike">
        <i class="bi bi-heart">{{ likes }}</i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";

const emit = defineEmits(["like"]);

const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  likes: { type: String, required: true },
  price: { type: String, required: true },
  featuredImage: { type: ArrayBuffer, required: true },
});

const getImageDataUrl = () => {
  if (props.featuredImage && props.featuredImage.data) {
    const arrayBuffer = new Uint8Array(props.featuredImage.data); // Convert Buffer to Uint8Array
    const blob = new Blob([arrayBuffer], { type: "image/jpeg" }); // Create Blob
    return URL.createObjectURL(blob); // Return URL
  }
  return "";
};

function handleLike() {
  emit("like", props.id);
}
</script>

<style scoped>
.card-img-top {
  width: 100%;
  height: 10vw;
  object-fit: cover;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.card {
  width: 18rem;
}
</style>
