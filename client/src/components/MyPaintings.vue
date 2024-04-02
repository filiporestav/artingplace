<template>
    <div>
        <h1>Paintings</h1>
        <h2>{{ userStore.username }}, you have {{ myPaintings.length }} listed artworks on Artingplace.</h2>
        <div class="paintings-container">
            <PaintingItem
              v-for="(painting, index) in myPaintings"
              :key="index"
              :id="painting.painting_id"
              :name="painting.name"
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
  
  const myPaintings = ref([])
  
  onMounted(() => {
    fetch("/api/myPaintings", {
      method: "GET",
    })
    .then(response => {
      if (response.ok) {
        return response.json()
      }
      else throw new Error("Error from GET request from paintings")
    })
    .then(data => {
      myPaintings.value = data // Update the paintings array with our fetched data
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
  