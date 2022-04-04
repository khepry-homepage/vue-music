<template>
  <div>
    <div class="ar-pic cursor" @click="handleClick">
      <img v-lazy="artist.img1v1Url" alt="">
    </div> 
    <p class="cursor" @click="handleClick">{{artist.name}}</p>
  </div>
</template>
<script>
export default {
  name: 'ArtistAvatar',
  components: {},
  props: {
    artist: {
      type: Object,
      require: true
    }
  },
  methods: {
    handleClick() {
      this.$bus.$emit('routeArtist', { id: this.artist.id });
    }
  },
};
</script>
<style scoped>

.ar-pic {
  position: relative;
  width: 100%;
  padding-top: 100%;
  border-radius: 0.3rem;
  border: 1px solid rgb(199, 197, 197);
}
.ar-pic > img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.3rem;
}
</style>