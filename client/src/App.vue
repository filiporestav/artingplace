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
    socket: null,
    niceCookie: null,
  }),
  async mounted() {
    const userStore = userDataStore();
    // Initialize the paintings list inside browser store
    this.fetchPaintings();

    this.addEventListeners();

    // Parse cookie
    this.niceCookie = this.parseCookie();

    // Check if signed in through cookie
    fetch(`/api/isLoggedIn`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("You are not logged in");
        }
        return response.json();
      })
      .then((data) => {
        userStore.login(data.username, data.cookie);
        console.log("You are now authenticated");
      })
      .catch((error) => {
        console.log("You are not logged in", error);
      });

    this.socket = io.connect({
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on("loggedIn", (userData) => {
      const { username, cookie } = userData;
      userStore.login(username, cookie);
      console.log("You are now logged in again");
    });

    this.initSocket(this.socket); // Save the socket instance in Pinia store

    // Listen on updated paintings
    this.socket.on("updatePaintingList", (paintings) => {
      this.updatePaintings(paintings);
      console.log("Updated paintings");
    });

    this.socket.on("loggedOut", () => {
      userStore.logout();
      document.cookie = "niceCookie= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"; // Delete cookie
      console.log("Logged out due to inactivity");
      this.$router.push("/login");
    });
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
      document.addEventListener("mousemove", this.resetTimer);
      document.addEventListener("click", this.resetTimer);
      document.addEventListener("scroll", this.resetTimer);
      document.addEventListener("popstate", this.resetTimer);
    },
    resetTimer() {
      const userStore = userDataStore();
      userStore.socket.emit("activity");
    },
    parseCookie() {
      console.log("Cookie array:", document.cookie);
      const cookies = document.cookie.split("; ");
      console.log("Splitted cookies:", cookies);
      const niceCookie = cookies.find((cookie) =>
        cookie.startsWith("niceCookie")
      );
      if (niceCookie) {
        const keyValue = niceCookie.split("=");
        if (keyValue.length === 2) {
          const [, cookieValue] = keyValue;
          return cookieValue;
        }
      }
      return null; // If no niceCookie found
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
