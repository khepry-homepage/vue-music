<template>
  <div class="single-song" :style="defaultStyle">
    <div class="banner cursor">
      <img :src="newsong.picUrl || newsong.album.blurPicUrl" :style="imgSize" alt="">
    </div>
    <div class="song-info flex-col-vertical-center">
      <slot :ns="newsong"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SongView',
  components: {},
  props: {
    newsong: {},
    defaultStyle: {
      type: Object,
      default: function() {
        return { width: '10rem', height: '3rem' }
      }
    },
    imgSize: {
      type: Object,
      default: function() {
        return { width: '3rem', height: '3rem' }
      }
    }
  },
  watch: {
  },
  computed: {},
  methods: {},
  created() {
  
  },
  mounted() {
  }
};
</script>
<style scoped>
.banner {
  position: relative;
}
.banner > img {
  border-radius: 0.3rem;
}
.single-song {
  display: flex;
  border-radius: 0.3rem;
}
.song-info {
  flex: 1;
  overflow: hidden; /* 溢出内容隐藏 */
  padding-left: 0.5rem;
}
.song-info > div {
  width: 100%;
  overflow: hidden; /* 溢出内容隐藏 */
  white-space: nowrap; /* 禁止文本换行 */ 
  text-overflow: ellipsis; /* 溢出文本替换为省略号 */
}
/* 添加歌曲上的提示播放图标 */
.banner::before {
  content: "\e615";
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-family: "iconfont" !important;
  font-size: 1.5rem;
}
</style>