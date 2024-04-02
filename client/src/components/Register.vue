<template>
    <div class="sign-in-container">
      <main class="form-signin w-100 m-auto">
      <form @submit.prevent="onSubmit">
        <img class="mb-4" src="" alt="" width="72" height="57">
        <h1 class="h3 mb-3 fw-normal">Register</h1>
  
        <div class="form-floating">
          <input v-model="email" type="email" class="form-control" id="floatingEmail" placeholder="name@example.com">
          <label for="floatingEmail">Email address</label>
        </div>
        <div class="form-floating">
          <input v-model="username" type="text" class="form-control" id="floatingUsername" placeholder="Username">
          <label for="floatingUsername">Username</label>
        </div>
        <div class="form-floating">
          <input v-model="password" type="password" class="form-control" id="floatingPassword" placeholder="Password" autocomplete="on">
          <label for="floatingPassword">Password</label>
        </div>
        <div class="form-floating">
          <input v-model="confirmedPassword" type="password" class="form-control" id="floatingConfirmPassword" placeholder="Confirm password" autocomplete="on">
          <label for="floatingConfirmPassword">Confirm password</label>
        </div>

        <div v-if="message!== ''" id="msg-text">
            {{message}}
        </div>
  
        <div class="form-check text-start my-3">
          <input class="form-check-input" type="checkbox" value="remember-me" id="flexCheckDefault">
          <label class="form-check-label" for="flexCheckDefault">
            I accept Terms and Conditions
          </label>
        </div>
        <button @click.prevent="register" class="btn btn-primary w-100 py-2" type="submit">Register</button>
      </form>
      </main>
    </div>
  
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import UserService from '../services/UserService.js'
  
  const email = ref("")
  const username = ref("")
  const password = ref("")
  const confirmedPassword = ref("")
  const message = ref('')
  
  async function register() {
    try {
      console.log(email.value, username.value, password.value, confirmedPassword.value)
      const response = await fetch("/api/user", {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: email.value, username: username.value, password: password.value, confirmedPassword: confirmedPassword.value})
        })

        if (!response.ok) {
            // Handle HTTP errors
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Await the parsing of the JSON
        console.log(data);
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
    color: rgb(31, 31, 31);
  }

  </style>