<template>
    <div class="card" style="width: 18rem;">
        <div class="card-header">
            {{title}} by {{ artist }}
        </div>
        <div class="card-body">
            <img src="..." class="card-img-top" alt="...">
        </div>
        <div class="card-footer text-body-secondary">
            ${{ price }}
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