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
import userDataStore from "./js/stores/authenticated";

export default {
  name: "ArtingPlace",
  components: { NavBar },
  data: () => ({
    socket: io.connect(),
  }),
  mounted() {
    const userStore = userDataStore()
    // Initialize the paintings list inside browser store
    this.fetchPaintings();

    this.initSocket(this.socket) // Save the socket instance in Pinia store

    this.addEventListeners()

    this.socket.on("updatePaintingList", (paintings) => {
      this.updatePaintings(paintings);
      console.log("Updated paintings");
    });

    this.socket.on("loggedOut", () => {
      userStore.logout()
      console.log("Logged out due to inactivity")
      this.$router.push("/login")
    })
  },
  methods: {
    ...mapActions(paintingStore, ["updatePaintings"]),
    ...mapActions(userDataStore, ["initSocket"]),

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
          this.updatePaintings(data);
        })
        .catch((err) => console.error(err));
    },
    addEventListeners() {
      document.addEventListener("mousemove", this.resetTimer)
      document.addEventListener("click", this.resetTimer)
      document.addEventListener("scroll", this.resetTimer)
    },
    resetTimer() {
      const userStore = userDataStore()
      userStore.socket.emit("activity")
    }
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
