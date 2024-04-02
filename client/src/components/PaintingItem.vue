<template>
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            Title: {{name}} <div v-if="username">by <strong>{{ username }}</strong></div>
        </div>
        <div class="card-body">
            <router-link :to="'/painting/' + id">
            <img :src="getImageDataUrl()" alt="Featured image" class="card-img-top">
            </router-link>
        </div>
        <div class="card-footer text-body-secondary">
            ${{ price }}
            <button @click="like"><i class="bi bi-heart">{{ likes }}</i></button>
        </div>
    </div>
</template>

<script setup>
import { userDataStore } from '../js/stores/authenticated.js';
import { storeToRefs } from 'pinia'

const userStore = userDataStore()
const { authenticated } = storeToRefs(userStore)

const props = defineProps({
    id: String,
    name: String,
    username: String,
    likes: Number,
    price: Number,
    featuredImage: ArrayBuffer
})

const getImageDataUrl = () => {
    if (props.featuredImage && props.featuredImage.data) {
        const arrayBuffer = new Uint8Array(props.featuredImage.data); // Convert Buffer to Uint8Array
        const blob = new Blob([arrayBuffer], { type: 'image/jpeg' }); // Create Blob
        return URL.createObjectURL(blob); // Return URL
    } else {
        return ''; // or you can have a placeholder image URL here
    }
}

// Like the painting
function like() {
    if (!authenticated.value) {
        console.log(authenticated.value)
        console.log("You must sign in to like a painting")
    }
    else {
        fetch(`/api/like/${props.id}`, {
        method: 'POST',
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            else {
                throw new Error("Bad response when trying to like the painting")
            }
        })
        .then((data) => {
            props.likes = data.likes // Update the likes
        })
        .catch(error => {
            console.error("Failed to like the painting", error)
        })
    }
    }

</script>

<style scoped>
.card-img-top {
    width: 100%;
    height: 10vw;
    object-fit: cover;
}

.card-footer {
    display: flex;
    justify-content: space-between;
}
</style>