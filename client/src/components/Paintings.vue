<template>
  <div>
      <h1>Paintings</h1>
      <h2 v-if="authenticated">{{ username }}, here you can find {{ paintings.length }} artworks!</h2>
      <h2 v-else>Here you can find some really inspiring artwork! Browse through {{ paintings.length }} fantastic paintings.</h2>
      <div class="paintings-container">
          <PaintingItem @like="updateLikes"
            v-for="(painting, index) in paintings"
            :key="index"
            :id="painting.painting_id"
            :name="painting.name"
            :username="painting.username"
            :featuredImage="painting.featuredImageData"
            :likes="painting.likes"
            :price="painting.price"
          ></PaintingItem>
      </div>
  </div>
</template>

<script>
import PaintingItem from './PaintingItem.vue'
import { userDataStore } from '../js/stores/authenticated';
import { paintingStore } from '../js/stores/paintings'
import { mapState, mapActions } from 'pinia'

export default {
  components: {
    PaintingItem,
  },
  computed: {
    ...mapState(paintingStore, {
      paintings: 'paintings'
    }),
    ...mapState(userDataStore, {
      username: 'username',
      authenticated: 'authenticated'
    })
  },
  methods: {
    ...mapActions(paintingStore, ['changeLikes']),
    // Like the painting
    async updateLikes(paintingId) {
        console.log(this.authenticated);
        if (!this.authenticated) {
            console.log("You must sign in to like a painting");
        } else {
            try {
                const response = await fetch(`/api/like/${paintingId}`, {
                    method: 'POST',
                });
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error("Failed to like the painting:", errorMessage);
                } else {
                    const data = await response.json();
                    console.log(data)
                    this.changeLikes(paintingId, data.likes) // Update the likes

                    const { socket } = this.$root
                    console.log(this.paintings)
                    socket.emit("paintingsChanged", this.paintings)
                }
            } catch (error) {
                console.error("Failed to like the painting", error);
            }
        }
  }
  }
}

</script>

<style scoped>
.paintings-container {
  display: flex;
  flex-wrap: wrap;
  width: fit-content;
  margin: 30px auto;
  gap: 15px;
  justify-content: space-between;
}
.painting {
  flex-basis: calc(25% - 15px);
}
</style>
