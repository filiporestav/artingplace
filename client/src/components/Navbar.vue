<template>
  <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div
        class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start"
      >
        <a class="navbar-brand">
          <img
            src="../assets/Artingplace.png"
            alt="Artingplace logo"
            width="200"
            height="40"
          />
        </a>

        <ul
          class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0"
        >
          <li>
            <router-link to="/paintings" class="nav-link px-2 link-secondary"
              >All paintings</router-link
            >
          </li>
          <li>
            <router-link to="/about" class="nav-link px-2 link-secondary"
              >About Us</router-link
            >
          </li>
          <li v-if="authenticated">
            <router-link to="/addpainting" class="nav-link px-2 link-secondary"
              >Add painting</router-link
            >
          </li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            class="form-control"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>

        <div v-if="authenticated" class="dropdown text-end">
          <a
            href="#"
            class="d-block link-dark text-decoration-none dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >My profile
          </a>
          <ul class="dropdown-menu text-small">
            <li>
              <router-link to="/mypaintings" class="dropdown-item"
                >My paintings</router-link
              >
            </li>
            <li>
              <router-link to="/profile" class="dropdown-item"
                >Profile</router-link
              >
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <button type="button" class="dropdown-item" @click="logout">
                Sign out
              </button>
            </li>
          </ul>
        </div>
        <div v-else class="navbar-btns">
          <nav class="navbar">
            <form class="container-fluid justify-content-start">
              <button
                class="btn btn-primary"
                type="button"
                @click="redirect('/login')"
              >
                Login
              </button>
            </form>
          </nav>
          <nav class="navbar">
            <form class="container-fluid justify-content-start">
              <button
                class="btn btn-primary"
                type="button"
                @click="redirect('/register')"
              >
                Register
              </button>
            </form>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import userDataStore from "../js/stores/authenticated";

const store = userDataStore();
const router = useRouter();

const { authenticated } = storeToRefs(store);

function redirect(target) {
  router.push(target);
}

function logout() {
  fetch("/api/user", {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      store.logout();
      store.socket.emit("logout") // Delete session from backend
    }
  });
}
</script>

<style scoped>
.navbar-btns {
  display: flex;
}
</style>
