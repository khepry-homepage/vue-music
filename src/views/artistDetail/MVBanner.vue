<template>
  <div>
    <div class="banner cursor">
      <img v-lazy="mv.imgurl || mv.cover" alt="">
      <span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-music-play-count"></use>
        </svg>
        {{Number(mv.playCount).FormatCH()}}
      </span>
      <span v-if="mv.duration">{{Number(mv.duration / 1000).FormatHMS()}}</span>
    </div>
    <slot name="mv-desc"></slot>
  </div>
</template>

<script>
export default {
  name: 'MVBanner',
  components: {},
  props: {
    mv: {
      require: true
    }
  },
  watch: {},
  mounted() {}
};
</script>
<style scoped>
  /* 宽高比2:1 */
  .banner {
    width: 100%;
    padding-top: 50%;
    position: relative;
    border-radius: 0.5rem;
  }
  .banner > img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.5rem;
    z-index: 1;
  }
  .banner > span {
    color: white;
  }
  .banner > span:nth-child(2) {
    position: absolute;
    right: 1rem;
    top: 0;
    z-index: 2;
  }
  .banner > span:nth-child(3) {
    position: absolute;
    right: 1rem;
    bottom: 0;
    z-index: 2;
  }
  
</style>