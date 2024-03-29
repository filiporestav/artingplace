import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from '../js/router'
import App from '../App.vue'
import 'bootstrap/dist/css/bootstrap.css' // For css
import 'bootstrap-icons/font/bootstrap-icons.css' // For icons
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js' // For js

const pinia = createPinia() // Used for state management
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(bootstrap)
app.mount('#app')
