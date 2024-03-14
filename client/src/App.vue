<template>
  <NavBar></NavBar>
  <div class="main-content">
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
import io from 'socket.io-client'

const socket = io().connect()

socket.emit("connection", () => {
  console.log("Client socket connected")
})

</script>

<style scoped>
.main-content {
  margin: auto;
  text-align: center;
  padding: 1rem;
}
</style>