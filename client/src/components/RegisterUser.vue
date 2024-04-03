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

const store = userDataStore();

const email = ref("");
const username = ref("");
const password = ref("");
const confirmedPassword = ref("");
const message = ref("");

async function register() {
  try {
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
    const registerResponse = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!registerResponse.ok) {
      message.value = await registerResponse.text();
      throw new Error("Failed to register user");
    }

    // Login user after successful registration
    const loginResponse = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (loginResponse.ok) {
      const responseData = await loginResponse.json();
      console.log("You successfully logged in");
      store.login(responseData.username, responseData.cookie);
      router.push("/paintings");
    } else {
      throw new Error("Failed to log in after registration");
    }
  } catch (err) {
    console.error("Error during registration: ", err);
  }
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
