<template>
  <div>
      <h1>Paintings</h1>
      <h2 v-if="userStore.authenticated">{{ userStore.username }}, here you can find {{ paintings.length }} artworks!</h2>
      <h2 v-else>Here you can find some really inspiring artwork! Browse through {{ paintings.length }} fantastic paintings.</h2>
      <div class="paintings-container">
          <PaintingItem
            v-for="(painting, index) in paintings"
            :key="index"
            :id="painting.painting_id"
            :name="painting.name"
            :username="painting.username"
            :featuredImage="painting.featuredImageData"
            :likes="painting.likes"
            :price="painting.price"
          ></PaintingItem>
      </div>
  </div>
</template>

<script setup>
import PaintingItem from './PaintingItem.vue'
import { userDataStore } from '../js/stores/authenticated';
import { ref, onMounted } from 'vue';

const userStore = userDataStore()

const paintings = ref([])

onMounted(() => {
  fetch("/api/paintings", {
    method: "GET",
  })
  .then(response => {
    if (response.ok) {
      return response.json()
    }
    else throw new Error("Error from GET request from paintings")
  })
  .then(data => {
    paintings.value = data // Update the paintings array with our fetched data
  })
  .catch(err => {
    console.error(err)
  })
})

</script>

<style scoped>
.paintings-container {
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  margin: 30px auto;
  gap: 15px;
  justify-content: space-between;
}
.painting {
  flex-basis: calc(25% - 15px);
}
</style>
