<template>
  <div>
    <h1>{{ userStore.username }}'s paintings</h1>
    <h2>You have {{ myPaintings.length }} listed artworks on Artingplace.</h2>
    <div class="paintings-container">
      <PaintingItem
        v-for="(painting, index) in myPaintings"
        :id="painting.painting_id"
        :key="index"
        :name="painting.name"
        :user-id="painting.user_id"
        :image-url="`/api/image/${painting.painting_id}`"
        :likes="painting.likes"
        :price="painting.price"
        @delete="deletePainting(index)"
      ></PaintingItem>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import PaintingItem from "./PaintingItem.vue";
import userDataStore from "../js/stores/authenticated";
import paintingStore from "../js/stores/paintings";

const userStore = userDataStore();
const thePaintingStore = paintingStore();
const myPaintings = ref([]);

onMounted(() => {
  myPaintings.value = thePaintingStore.getPaintingsFrom(
    userStore.cookie
  );
})

// Check if I own a certain painting id (early stopping)
function checkIfMyPainting(paintingId) {
  return myPaintings.value.some(painting => painting.painting_id === paintingId);
}

function deletePainting(index) {
  const paintingId = myPaintings.value[index].painting_id
  console.log("Received request to delete painting")
  console.log(checkIfMyPainting(paintingId))
  if (checkIfMyPainting(paintingId)) {
    fetch(`/api/painting/${paintingId}`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({paintingId})
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not delete painting")
      }
      return response.json()
    })
    .then((res) => {
      console.log(res.message)
      myPaintings.value.splice(index, 1);
      // Send call to other clients
      userStore.socket.emit("paintingsChanged")
    })
    .catch((error) => {
      console.error("Error deleting painting", error)
    })
  }
}
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