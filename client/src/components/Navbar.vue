<template>
    <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a class="navbar-brand">
          <img src="../assets/Artingplace.png" alt="Artingplace logo" width="200" height="40">
        </a>

        <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><router-link to="/paintings" class="nav-link px-2 link-secondary">All paintings</router-link></li>
          <li><router-link to="/about" class="nav-link px-2 link-secondary">About Us</router-link></li>
        </ul>

        <form class="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input type="search" class="form-control" placeholder="Search..." aria-label="Search">
        </form>

        <div v-if="authenticated" class="dropdown text-end">
          <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-small" style="">
            <li><router-link to="/sellpainting" class="dropdown-item">Sell painting</router-link></li>
            <li><router-link to="/settings" class="dropdown-item">Settings</router-link></li>
            <li><router-link to="/profile" class="dropdown-item">Profile</router-link></li>
            <li><hr class="dropdown-divider"></li>
            <li><button @click="logout" class="dropdown-item">Sign out</button></li>
          </ul>
        </div>
        <div v-else class="navbar-btns">
          <nav class="navbar">
          <form class="container-fluid justify-content-start">
            <button class="btn btn-primary" @click="redirect('/login')" type="button">Login</button>
          </form>
          </nav>
          <nav class="navbar">
          <form class="container-fluid justify-content-start">
            <button class="btn btn-primary" @click="redirect('/register')" type="button">Register</button>
          </form>
          </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { userDataStore } from '../js/stores/authenticated'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const store = userDataStore()
const router = useRouter()

const { authenticated } = storeToRefs(store)

function redirect(target) {
  router.push(target)
}

function logout() {
  console.log("Logged out")
  store.authenticated = false
  store.username = null
}

</script>

<style scoped>
.navbar-btns {
  display: flex;
}
</style>