<template>
  <div>
    <div class="cover cursor" @click="handleClick">
      <img v-lazy="playlist.picUrl || playlist.coverImgUrl" alt="">
      <span>
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-music-play-count"></use>
        </svg>
        {{playlist.playCount.FormatCH()}}
      </span>
    </div>
    <slot name="desc"></slot>
  </div>
</template>
<script>
export default {
  name: 'SinglePlayList',
  props: {
    'playlist': {
      type: Object,
      default: {}
    },
  },
  methods: {
    handleClick() {
      this.$store.commit('setNavigationName', { name: '歌单详情' });
      this.$router.push( { name: '歌单详情', params: { id: this.playlist.id } } );
    }
  },
}
</script>
<style scoped>
  .cover {
    position: relative;
    width: 100%;
    padding-top: 100%;
    border-radius: 0.3rem;
  }
  .cover > img {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 0.3rem;
  }
  .cover > span {
    position: absolute;
    top: 0;
    right: 1rem;
    color: white;
  }
  /* 添加鼠标移动到歌单上的提示图标 */
  .cover:hover::after {
    content: "\e615";
    background-color: white;
    border-radius: 50%;
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    font-family: "iconfont" !important;
    font-size: 1.5rem;
  }
</style>