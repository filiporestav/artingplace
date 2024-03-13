import { createRouter, createWebHistory} from 'vue-router';
import Home from '../../components/Home.vue';
import Paintings from '../../components/Paintings.vue';

// Define the routes
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/paintings',
        component: Paintings
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // use HTML5 Mode for history implementation
    routes, // short for 'routes:routes'
});

export default router;