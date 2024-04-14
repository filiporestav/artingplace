<template>
  <div class="sign-in-container">
    <main class="form-signin w-100 m-auto">
      <form @submit.prevent="onSubmit">
        <img class="mb-4" src="" alt="" width="72" height="57" />
        <h1 class="h3 mb-3 fw-normal">Register</h1>

        <div class="form-floating">
          <input
            id="floatingEmail"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="name@example.com"
          />
          <label for="floatingEmail">Email address</label>
        </div>
        <div class="form-floating">
          <input
            id="floatingUsername"
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Username"
          />
          <label for="floatingUsername">Username</label>
        </div>
        <div class="form-floating">
          <input
            id="floatingPassword"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Password"
            autocomplete="on"
          />
          <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating">
          <input
            id="floatingConfirmPassword"
            v-model="confirmedPassword"
            type="password"
            class="form-control"
            placeholder="Confirm password"
            autocomplete="on"
          />
          <label for="floatingConfirmPassword">Confirm password</label>
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
            I accept Terms and Conditions
          </label>
        </div>
        <button
          class="btn btn-primary w-100 py-2"
          type="submit"
          @click.prevent="register"
        >
          Register
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import userDataStore from "../js/stores/authenticated";

const router = useRouter();

const userStore = userDataStore();

const email = ref("");
const username = ref("");
const password = ref("");
const confirmedPassword = ref("");
const message = ref("");

async function register() {

    if (password.value !== confirmedPassword.value) {
      message.value = "Password and confirmed password do not match.";
      return; // Exit early if passwords don't match
    }

    const userData = {
      email: email.value,
      username: username.value,
      password: password.value,
      confirmedPassword: confirmedPassword.value,
    };

    // Register user
    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Registration failed"); // Throw error if registration fails
      }
      return response.json(); // Parse response data
    })
    .then(data => {
      message.value = data.message; // Set message regardless of response status
      // Log in the user after successful registration
      return fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
    })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Login failed"); // Throw error if login fails
      }
      const data = await res.json(); // Parse login response data
      message.value = data.message; // Set message from login response
      // Create express socket io session
      userStore.socket.emit("login", [data.username, data.cookie]);
      userStore.login(data.username, data.cookie);
      // Redirect to paintings page if successfully logged in
      if (userStore.authenticated) {
        router.push("/paintings");
      }
    })
    .catch((error) => {
      // Catch any errors during the fetch or processing
      message.value = error.message; // Display error message
    });

}
</script>

<style scoped>
.sign-in-container {
  margin: auto;
  width: 400px;
}

#msg-text {
  margin-top: 5px;
  font-size: 14px;
  color: rgb(31 31 31);
}
</style>
