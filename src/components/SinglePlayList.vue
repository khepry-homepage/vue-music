<template>
  <div>
    <div class="cover cursor" :style="defaultStyle" @click="handleClick">
      <img class="pic" :src="playlist.picUrl || playlist.coverImgUrl" alt="">
      <span class="play-count">
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
    'defaultStyle': {
      type: Object,
      default: function () {
        return { width: '10rem', height: '10rem'}      
      } 
    }
  },
  methods: {
    handleClick() {
      this.$router.push( { name: '歌单详情', params: { id: this.playlist.id } } );
    }
  },
}
</script>
<style scoped>
  .cover {
    position: relative;
    border-radius: 0.3rem;
  }
  .play-count {
    position: absolute;
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
  .pic {
    width: 100%;
    border-radius: 0.3rem;
  }
</style>