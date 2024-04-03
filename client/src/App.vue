<template>
  <NavBar></NavBar>
  <div class="main-content">
    <router-view></router-view>
  </div>
</template>

<script>
import { io } from "socket.io-client";
import { mapActions } from "pinia";
import NavBar from "./components/NavBar.vue";
import paintingStore from "./js/stores/paintings";

export default {
  name: "ArtingPlace",
  components: { NavBar },
  data: () => ({
    socket: io.connect(),
  }),
  mounted() {
    // Initialize the paintings list inside browser store
    this.fetchPaintings();

    this.socket.on("updatePaintingList", (paintings) => {
      this.updatePaintings(paintings);
      console.log("Updated paintings");
    });
  },
  methods: {
    ...mapActions(paintingStore, ["updatePaintings"]),

    fetchPaintings() {
      fetch("/api/paintings", {
        method: "GET",
      })
        .then((response) =>
          response.ok
            ? response.json()
            : Promise.reject(new Error("Failed to fetch paintings"))
        )
        .then((data) => {
          // this.paintings = data;
          this.updatePaintings(data);
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>

<style scoped>
.main-content {
  margin: auto;
  text-align: center;
  padding: 1rem;
}
</style>
