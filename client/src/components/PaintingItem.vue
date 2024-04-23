<template>
  <div class="card">
    <div class="card-header"><b>Title:</b> {{ name }}</div>
    <div class="card-body">
      <router-link :to="'/painting/' + id">
        <img :src="imageUrl" alt="Featured image" class="card-img-top" />
      </router-link>
    </div>
    <div class="card-footer text-body-secondary">
      ${{ price }}
      <button type="button" @click="handleLike">
        <i class="bi bi-heart">{{ likes }}</i>
      </button>
    </div>
    <button
      v-if="userStore.cookie === userId && userStore.cookie"
      type="button"
      @click="deletePainting"
    >
      Delete
    </button>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import userDataStore from "../js/stores/authenticated";

const emit = defineEmits(["delete", "like"]);
const userStore = userDataStore();

const props = defineProps({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  likes: { type: String, required: true },
  price: { type: String, required: true },
  imageUrl: { type: String, required: true },
});

function deletePainting() {
  emit("delete", props.id);
}

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
