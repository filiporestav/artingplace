<template>
  <div class="sign-in-container">
    <main class="form-signin w-100 m-auto">
    <form>
      <img class="mb-4" src="..." alt="" width="72" height="57">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword">Password</label>
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button @click="login" class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
    </main>
  </div>

</template>

<script setup>
import { ref } from 'vue'

const email = ref("")
const password = ref("")

function login() {
  fetch("/api/login"), {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({email, password})
  }
  .then((response) => {
    if (!response.ok)
      return new Error("Failed to send valid credentials")
  })
  .then(
    console.log(response.json())
  )
  .catch(err => {
    console.error(err)
  })
}

</script>

<style scoped>
.sign-in-container {
  margin: auto;
  width: 400px;
}
</style>