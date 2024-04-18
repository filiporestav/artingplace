<template>
  <div>
    <h1>{{ userStore.username }}'s paintings</h1>
    <h2>
      You have {{ myPaintings.length }} listed
      artworks on Artingplace.
    </h2>
    <div class="paintings-container">
      <PaintingItem
        v-for="(painting, index) in myPaintings"
        :id="painting.painting_id"
        :key="index"
        :name="painting.name"
        :username="painting.username"
        :image-url="`/api/image/${painting.painting_id}`"
        :likes="painting.likes"
        :price="painting.price"
      ></PaintingItem>
    </div>
  </div>
</template>

<script>
import PaintingItem from "./PaintingItem.vue";
import userDataStore from "../js/stores/authenticated";
import paintingStore from "../js/stores/paintings";

export default {
  components: {
    PaintingItem
  },
  data() {
    return {
      userStore: userDataStore(),
      paintingStore: paintingStore(),
      myPaintings: []
    };
  },
  mounted() {
    this.myPaintings = this.paintingStore.getPaintingsFrom(this.userStore.cookie)
  }
};
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