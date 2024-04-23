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

const userStore = userDataStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const message = ref("");

function login() {
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        message.value = data.message;
        // Create express socket io session
        userStore.socket.emit("login", [data.username, data.cookie]);
        userStore.login(data.username, data.cookie);
        // Redirect to paintings page if successfully logged in
        console.log(userStore.authenticated);
        if (userStore.authenticated) {
          router.push("/paintings");
        }
      } else {
        const errMsg = await res.json();
        message.value = errMsg.message;
        throw Error("Error signing in");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>

<style scoped>
.sign-in-container {
  margin: auto;
  width: 400px;
}
</style>
