<template>
  <div>
    <div class="ar-pic cursor">
      <img :src="artist.img1v1Url" alt="">
    </div> 
    <p class="cursor">{{artist.name}}</p>
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
  data() {
    return {

    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {}
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