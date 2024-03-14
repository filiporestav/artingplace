<template>
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            {{title}} by <strong>{{ artist }}</strong>
        </div>
        <div class="card-body">
            <a href="/">
                <img src="../assets/artwork1.jpg" class="card-img-top" alt="...">
            </a>
        </div>
        <div class="card-footer text-body-secondary">
            ${{ price }}
            <i class="bi bi-heart">{{ likes }}</i>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    title: String,
    likes: Number,
    artist: String,
    price: Number,
    imgSource: String
})

const title = ref(props.title)
const likes = ref(props.likes)

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