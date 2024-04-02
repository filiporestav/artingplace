import { createRouter, createWebHistory} from 'vue-router';
import Home from '../../components/Home.vue';
import Paintings from '../../components/Paintings.vue';
import About from '../../components/About.vue';
import Login from '../../components/Login.vue';
import Register from '../../components/Register.vue';
import AddPainting from '../../components/AddPainting.vue';
import PaintingPage from '../../components/PaintingPage.vue';
import MyPaintings from '../../components/MyPaintings.vue';

// Define the routes
const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/paintings',
        component: Paintings
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    },
    {
        path: '/addpainting',
        component: AddPainting
    },
    {
        path: '/painting/:paintingId',
        component: PaintingPage
    },
    {
        path: '/myPaintings',
        component: MyPaintings
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL), // use HTML5 Mode for history implementation
    routes, // short for 'routes:routes'
});

export default router;