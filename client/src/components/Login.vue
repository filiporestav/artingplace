<template>
  <div class="sign-in-container">
    <main class="form-signin w-100 m-auto">
    <form>
      <img class="mb-4" src="" alt="" width="72" height="57">
      <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

      <div class="form-floating">
        <input v-model="email" type="email" class="form-control" id="floatingInput" placeholder="name@example.com">
        <label for="floatingInput">Email address</label>
      </div>
      <div class="form-floating">
        <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password">
        <label for="floatingPassword" autocomplete="on">Password</label>
      </div>

      <div v-if="message!== ''" id="msg-text">
            {{message}}
      </div>

      <div class="form-check text-start my-3">
        <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
        <label class="form-check-label" for="flexCheckDefault">
          Remember me
        </label>
      </div>
      <button @click.prevent="login" class="btn btn-primary w-100 py-2" type="submit">Sign in</button>
    </form>
    </main>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { userDataStore } from '../js/stores/authenticated.js'
import UserService from '../services/UserService.js'
import { useRouter } from 'vue-router'

const store = userDataStore()
const router = useRouter()

const email = ref("")
const password = ref("")
const message = ref('')

function login() {
  const promise = UserService.login(email.value, password.value)
  promise.then((data) => {
    store.authenticated = data.authenticated
    store.username = data.username
    message.value = data.message

    // Redirect to paintings page if successfully logged in
    if (store.authenticated) {
      router.push("/paintings")
    }
  })
}

</script>

<style scoped>
.sign-in-container {
  margin: auto;
  width: 400px;
}
</style>