<template>
  <Navbar></Navbar>
  <div class="main-content">
    <router-view></router-view>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style scoped>
.main-content {
  margin: auto;
  text-align: center;
  padding: 1rem;
}
</style>