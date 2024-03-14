<template>
    <header class="p-3 mb-3 border-bottom">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a class="navbar-brand" href="/">
          <img src="../assets/Artingplace.png" alt="Artingplace logo" width="200" height="40">
        </a>
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
          <svg class="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlink:href="#bootstrap"></use></svg>
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
            <li><router-link to="/logout" class="dropdown-item">Sign out</router-link></li>
          </ul>
        </div>
        <div v-else>
          <nav class="navbar">
          <form class="container-fluid justify-content-start">
            <button class="btn btn-primary" @click="redirect('/login')" type="button">Login</button>
          </form>
        </nav>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { userDataStore } from '@/js/stores/authenticated'
import { useRouter } from 'vue-router'

const store = userDataStore()
const router = useRouter()

const authenticated = store.authenticated

function redirect(target) {
  router.push(target)
}

</script>