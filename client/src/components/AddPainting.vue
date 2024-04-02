<template>
    <div class="container">
        <form @submit.prevent="uploadPainting" enctype="multipart/form-data">
            <div class="form-group col-md-8 offset-md-2">
                <input type="text" v-model="paintingName" class="form-control" placeholder="Name of painting" required>
                <input type="number" v-model="paintingPrice" class="form-control" placeholder="Price" min="1" step="0.01" required>
                <input type="file" ref="imageInput" class="form-control-file" multiple accept="image/*" @change="handleFileChange" required>
                <button type="submit" class="btn btn-primary">Upload</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            paintingName: '',
            paintingPrice: '',
            images: []
        };
    },
    methods: {
        handleFileChange(event) {
            // Store selected files
            this.images = event.target.files;
        },
        async uploadPainting() {
            // Create FormData object
            const formData = new FormData();
            formData.append('painting_name', this.paintingName);
            formData.append('painting_price', this.paintingPrice);
            
            // Append each selected image to the FormData
            for (let i = 0; i < this.images.length; i++) {
                formData.append('images', this.images[i]);
            }
            
            try {
                // Send FormData to backend
                const response = await fetch('/api/painting', {
                    method: "POST",
                    body: formData
                })
                console.log(response.data);
                // Reset form fields
                this.paintingName = '';
                this.paintingPrice = '';
                this.images = [];
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>