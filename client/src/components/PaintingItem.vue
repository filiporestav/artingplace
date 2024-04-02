<template>
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            {{name}} by <strong>{{ username }}</strong>
        </div>
        <div class="card-body">
            <router-link :to="'/painting/' + id">
            <img :src="getImageDataUrl()" alt="Featured image" class="card-img-top">
            </router-link>
        </div>
        <div class="card-footer text-body-secondary">
            ${{ price }}
            <i class="bi bi-heart">{{ likes }}</i>
        </div>
    </div>
</template>

<script setup>
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