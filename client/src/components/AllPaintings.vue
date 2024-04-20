<template>
  <div>
    <h1>Paintings</h1>
    <h2 v-if="authenticated">
      {{ username }}, here you can find {{ paintings.length }} artworks!
    </h2>
    <h2 v-else>
      Here you can find some really inspiring artwork! Browse through
      {{ paintings.length }} fantastic paintings.
    </h2>
    <div class="paintings-container">
      <PaintingItem
        v-for="(painting, index) in paintings"
        :id="painting.painting_id"
        :key="index"
        :name="painting.name"
        :user_id="painting.user_id"
        :image-url="`/api/image/${painting.painting_id}`"
        :likes="painting.likes"
        :price="painting.price"
        @like="updateLikes"
      ></PaintingItem>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import PaintingItem from "./PaintingItem.vue";
import userDataStore from "../js/stores/authenticated";
import paintingStore from "../js/stores/paintings";

export default {
  components: {
    PaintingItem,
  },
  computed: {
    ...mapState(paintingStore, {
      paintings: "paintings",
    }),
    ...mapState(userDataStore, {
      username: "username",
      authenticated: "authenticated",
    }),
  },
  mounted() {
    console.log(this.paintings);
  },
  methods: {
    ...mapActions(paintingStore, ["changeLikes"]),
    // Like the painting
    async updateLikes(paintingId) {
      console.log(this.authenticated);
      if (!this.authenticated) {
        console.log("You must sign in to like a painting");
      } else {
        try {
          const response = await fetch(`/api/like/${paintingId}`, {
            method: "POST",
          });
          const message = await response.text();
          if (!response.ok) {
            console.error("Failed to like the painting:", message);
          } else {
            console.log(message);
            const userstore = userDataStore();
            userstore.socket.emit("paintingsChanged");
          }
        } catch (error) {
          console.error("Failed to like the painting", error);
        }
      }
    },
  },
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
