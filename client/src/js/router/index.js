import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../../components/HomePage.vue";
import AllPaintings from "../../components/AllPaintings.vue";
import AboutPage from "../../components/AboutPage.vue";
import LoginPage from "../../components/LoginPage.vue";
import RegisterUser from "../../components/RegisterUser.vue";
import AddPainting from "../../components/AddPainting.vue";
import PaintingPage from "../../components/PaintingPage.vue";
import MyPaintings from "../../components/MyPaintings.vue";

// Define the routes
const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/paintings",
    component: AllPaintings,
  },
  {
    path: "/about",
    component: AboutPage,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterUser,
  },
  {
    path: "/addpainting",
    component: AddPainting,
  },
  {
    path: "/painting/:paintingId",
    component: PaintingPage,
  },
  {
    path: "/myPaintings",
    component: MyPaintings,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // use HTML5 Mode for history implementation
  routes, // short for 'routes:routes'
});

export default router;
