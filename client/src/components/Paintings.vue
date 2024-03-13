<template>
    <div>
        <h1>Paintings</h1>
        <div class="paintings-container">
            <Painting v-for="painting in paintings" 
            :key="painting.id"
            :title="painting.title"
            :imgSource="painting.imgSource"
            :likes="painting.likes"
            :artist="painting.artist"
            :price="painting.price">
        </Painting>
        </div>
    </div>
</template>

<script setup>
import Painting from './Painting.vue'

const paintings = [
    { id: 1, imgSource: "...", title: "Painting 1", likes: 5, artist: "Filip", price: 499 },
    { id: 2, imgSource: "...", title: "Painting 2", likes: 3, artist: "Hedda", price: 899 }
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