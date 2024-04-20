import { defineStore } from "pinia";

const userDataStore = defineStore("userDataStore", {
  // State properties
  state: () => ({
    socket: undefined,
    authenticated: false,
    username: undefined,
    cookie: undefined,
  }),
  actions: {
    initSocket(socket) {
      this.socket = socket;
    },
    login(username, cookie) {
      this.authenticated = true;
      this.username = username;
      this.cookie = cookie;
    },
    logout() {
      this.authenticated = false;
      this.username = undefined;
      this.cookie = undefined;
    },
  },
});

export default userDataStore;
