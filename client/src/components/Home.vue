<template>
    <div class="px-4 py-5 my-5 text-center">
    <img class="d-block mx-auto mb-4" src="../assets/Artingplace hero image.jpg" alt="" width="400" height="400">
    <h1 class="display-5 fw-bold">Artingplace</h1>
    <div class="col-lg-6 mx-auto">
      <p class="lead mb-4">Artingplace is a vibrant online marketplace where artists from all walks of life converge to showcase their creative brilliance, while art enthusiasts immerse themselves in a rich tapestry of expressive works, forging connections, and transforming spaces with each carefully chosen acquisition.</p>
      <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
        <button type="button" @click="this.$router.push('/paintings')" class="btn btn-primary btn-lg px-4 gap-3">See All Paintings</button>
        <button type="button" @click="this.$router.push('/about')" class="btn btn-outline-secondary btn-lg px-4">About Us</button>
      </div>
    </div>
  </div>
</template>