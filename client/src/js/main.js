import { createApp } from "vue";
import { createPinia } from "pinia";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle"; // For js
import router from "./router";
import App from "../App.vue";
import "bootstrap/dist/css/bootstrap.css"; // For css
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons

const app = createApp(App);
const pinia = createPinia(); // Used for state management
app.use(pinia);
app.use(router); // Setup pinia before router, as we use pinia in our router
app.use(bootstrap);
app.mount("#app");
