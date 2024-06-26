import { defineStore } from "pinia";

const paintingStore = defineStore("paintingStore", {
  state: () => ({
    paintings: [],
  }),
  actions: {
    // Updates the painting array
    updatePaintings(paintingList) {
      this.paintings = paintingList;
      console.log(this.paintings);
    },
    // Returns the painting array
    getPaintings() {
      return this.paintings;
    },
    // Add a painting to the array
    addPainting(painting) {
      this.paintings.push(painting);
    },
    // Updates the likes for a painting
    changeLikes(paintingId, newLikes) {
      const paintingIndex = this.paintings.findIndex(
        (p) => p.painting_id === paintingId
      );
      if (paintingIndex !== -1) {
        this.paintings[paintingIndex].likes = newLikes;
      }
    },
    getPaintingsFrom(userId) {
      const paintings = this.paintings.filter(
        (painting) => painting.user_id === userId
      );
      return paintings;
    },
  },
});

export default paintingStore;
