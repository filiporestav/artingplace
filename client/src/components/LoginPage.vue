<template>
  <div class="sign-in-container">
    <main class="form-signin w-100 m-auto">
      <form>
        <img class="mb-4" src="" alt="" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Please sign in</h1>

        <div class="form-floating">
          <input
            id="floatingInput"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="name@example.com"
          />
          <label for="floatingInput">Email address</label>
        </div>
        <div class="form-floating">
          <input
            id="floatingPassword"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Password"
          />
          <label for="floatingPassword" autocomplete="on">Password</label>
        </div>

        <div v-if="message !== ''" id="msg-text">
          {{ message }}
        </div>

        <div class="form-check text-start my-3">
          <input
            id="flexCheckDefault"
            class="form-check-input"
            type="checkbox"
            value="remember-me"
          />
          <label class="form-check-label" for="flexCheckDefault">
            Remember me
          </label>
        </div>
        <button
          class="btn btn-primary w-100 py-2"
          type="submit"
          @click.prevent="login"
        >
          Sign in
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import userDataStore from "../js/stores/authenticated";

const store = userDataStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

function login() {
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.text();
    })
    .then((data) => {
      store.login(data.username, data.cookie);
      message.value = data.message;

      // Redirect to paintings page if successfully logged in
      if (store.authenticated) {
        router.push("/paintings");
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>

<style scoped>
.sign-in-container {
  margin: auto;
  width: 400px;
}
</style>
