import { createApp } from "vue";
import { createPinia } from "pinia";

import bootstrap from "bootstrap/dist/js/bootstrap.bundle"; // For js
import router from "./router";
import App from "../App.vue";
import "bootstrap/dist/css/bootstrap.css"; // For css
import "bootstrap-icons/font/bootstrap-icons.css"; // For icons

const app = createApp(App);
const pinia = createPinia(); // Used for state management
app.use(router);
app.use(pinia);
app.use(bootstrap);
app.mount("#app");
