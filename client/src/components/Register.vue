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
          <input v-model="confirmPassword" type="password" class="form-control" id="floatingConfirmPassword" placeholder="Confirm password" autocomplete="on">
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
  const confirmPassword = ref("")
  const message = ref('')
  
  async function register() {
    if (password.value === confirmPassword.value) {
      const promise = UserService.register(email.value, username.value, password.value, confirmPassword.value)
      promise.then(data => message.value = data.message)
    }
    else {
      message.value = "Password and confirmed password must match"
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