<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <!-- Page title -->
        <div class="my-5">
          <h3>{{ userStore.username }} profile</h3>
          <hr />
        </div>
        <!-- Form START -->
        <form class="file-upload">
          <div class="row mb-5 gx-5">
            <!-- Contact detail -->
            <div class="col-xxl-8 mb-5 mb-xxl-0">
              <div class="bg-secondary-soft px-4 py-5 rounded">
                <div class="row g-3">
                  <h4 class="mb-4 mt-0">Contact details</h4>
                  <!-- Email -->
                  <div class="col-md-12">
                    <p v-if="emailMessage !== ''">{{ emailMessage }}</p>
                    <label for="inputEmail4" class="form-label"
                      >New email</label
                    >
                    <input
                      v-model="newEmail"
                      type="email"
                      class="form-control"
                      placeholder="your@email.com"
                    />
                    <button
                      type="button"
                      class="btn btn-primary mt-2"
                      @click="changeEmail"
                    >
                      Change Email
                    </button>
                  </div>
                </div>
                <!-- Row END -->
              </div>
            </div>
          </div>
          <!-- Row END -->

          <!-- change password -->
          <div class="row mb-5 gx-5">
            <div class="col-xxl-6">
              <div class="bg-secondary-soft px-4 py-5 rounded">
                <p v-if="passwordMessage !== ''">{{ passwordMessage }}</p>
                <div class="row g-3">
                  <h4 class="my-4">Change Password</h4>
                  <!-- Old password -->
                  <div class="col-md-6">
                    <label for="exampleInputPassword1" class="form-label"
                      >Old password *</label
                    >
                    <input
                      v-model="oldPassword"
                      type="password"
                      class="form-control"
                    />
                  </div>
                  <!-- New password -->
                  <div class="col-md-6">
                    <label for="exampleInputPassword2" class="form-label"
                      >New password *</label
                    >
                    <input
                      v-model="newPassword"
                      type="password"
                      class="form-control"
                    />
                  </div>
                  <!-- Confirm password -->
                  <div class="col-md-12">
                    <label for="exampleInputPassword3" class="form-label"
                      >Confirm Password *</label
                    >
                    <input
                      v-model="newConfirmPassword"
                      type="password"
                      class="form-control"
                    />
                  </div>
                </div>
                <button type="button" @click="changePassword">
                  Change password
                </button>
              </div>
            </div>
          </div>
          <!-- Row END -->
          <!-- button -->
          <div class="gap-3 d-md-flex justify-content-md-end text-center">
            <button
              type="button"
              class="btn btn-danger btn-lg"
              @click="deleteProfile"
            >
              Delete profile
            </button>
          </div>
        </form>
        <!-- Form END -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import userDataStore from "../js/stores/authenticated";

const userStore = userDataStore();
const router = useRouter();

const newEmail = ref("");
const emailMessage = ref("");

const oldPassword = ref("");
const newPassword = ref("");
const newConfirmPassword = ref("");
const passwordMessage = ref("");

function deleteProfile() {
  fetch(`/api/profile`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        userStore.logout(); // Delete from frontend (already deleted from backend)
        console.log("Profile deleted from backend");
        router.push("/paintings");
      } else {
        throw new Error("Failed to delete profile");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function changeEmail() {
  if (newEmail.value === "") {
    emailMessage.value = "Please enter a valid email.";
    return;
  }
  fetch(`/api/email`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newEmail: newEmail.value }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to change email");
      }
      return response.json();
    })
    .then((data) => {
      emailMessage.value = data.message || "Email successfully updated";
    })
    .catch((error) => {
      emailMessage.value = error.message || "An error occurred";
    });
}

function changePassword() {
  if (
    oldPassword.value === "" ||
    newPassword.value === "" ||
    newConfirmPassword.value === ""
  ) {
    passwordMessage.value =
      "You must provide the old password, the new password, and confirm the new password";
    return;
  }

  if (newPassword.value !== newConfirmPassword.value) {
    passwordMessage.value = "New password and confirm password do not match";
    return;
  }

  fetch(`/api/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      oldPassword: oldPassword.value,
      password: newPassword.value,
      confirmedPassword: newConfirmPassword.value,
    }),
  })
    .then(async (response) => {
      if (!response.ok) {
        // Check if response body contains JSON
        return response.json().then((data) => {
          throw new Error(data || "Failed to change password");
        });
      }
      return response.json();
    })
    .then((data) => {
      passwordMessage.value = data.message || "Password successfully updated";
    })
    .catch((error) => {
      passwordMessage.value = error.message || "An error occurred";
    });
}
</script>

<style scoped>
body {
  margin-top: 20px;
  color: #9b9ca1;
}

.bg-secondary-soft {
  background-color: rgb(208 212 217 / 10%) !important;
}

.rounded {
  border-radius: 5px !important;
}

.py-5 {
  padding-top: 3rem !important;
  padding-bottom: 3rem !important;
}

.px-4 {
  padding-right: 1.5rem !important;
  padding-left: 1.5rem !important;
}

.file-upload .square {
  height: 250px;
  width: 250px;
  margin: auto;
  vertical-align: middle;
  border: 1px solid #e5dfe4;
  background-color: #fff;
  border-radius: 5px;
}

.text-secondary {
  --bs-text-opacity: 1;

  color: rgb(208 212 217 / 50%) !important;
}

.btn-success-soft {
  color: #28a745;
  background-color: rgb(40 167 69 / 10%);
}

.btn-danger-soft {
  color: #dc3545;
  background-color: rgb(220 53 69 / 10%);
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.6;
  color: #29292e;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #e5dfe4;
  appearance: none;
  appearance: none;
  border-radius: 5px;
  transition: border-color 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out,
    -webkit-box-shadow 0.15s ease-in-out;
}
</style>
