<template>
    <div>
      <h1></h1>
        <h1>Paintings</h1>
        <h2 v-if="username">{{ username }}, here you can find some really inspiring artwork!</h2>
        <div class="paintings-container">
            <PaintingItem v-for="painting in paintings" 
            :key="painting.id"
            :title="painting.title"
            :imgName="painting.imgName"
            :likes="painting.likes"
            :artist="painting.artist"
            :price="painting.price">
        </PaintingItem>
        </div>
    </div>
</template>

<script setup>
import PaintingItem from './PaintingItem.vue'
import { userDataStore } from '../js/stores/authenticated';
import { storeToRefs } from 'pinia'

const store = userDataStore()
const { username } = storeToRefs(store)

const paintings = [
    { id: 1, imgName: "artwork1", title: "Painting 1", likes: 5, artist: "Filip", price: 499 },
    { id: 2, imgName: "artwork2", title: "Painting 2", likes: 3, artist: "Hedda", price: 899 }
]

</script>

<style scoped>
.paintings-container {
  display: flex;
  flex-wrap: wrap; /* Enable wrapping to multiple rows */
  width: fit-content; /* Shrink container to fit content */
  margin: 30px auto;
  gap: 15px;
  justify-content: space-between; /* Distribute evenly within container */
}

.painting {
  flex-basis: calc(25% - 15px); /* Adjust based on desired painting width and gap */
}

</style>