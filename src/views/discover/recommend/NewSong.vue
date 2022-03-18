<template>
  <div class="single-song">
    <div class="banner">
      <img :src="ns.picUrl" alt="">
    </div>
    <div class="song-info">
      <div>{{ns.name}}<span v-if="ns.song.alias.length" class="gray-font">（{{ns.song.alias[0]}}）</span></div>
      <div>
        <span v-for="(artist, idx) in ns.song.artists" 
          :key="idx"
          class="gray-font">
          {{artist.name + (idx !== ns.song.artists.length-1 ? ' / ':'')}}
        </span>  
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewSong',
  components: {},
  props: ['newsong'],
  data() {
    return {
      ns: this.newsong || {}
    };
  },
  watch: {
    newsong: {
      handler(newVal) {
        this.ns = newVal;
      }
    }
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
.banner > img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
}
.single-song {
  display: flex;
  position: relative;
  width: 10rem;
  height: 3rem;
  margin-bottom: 1rem;
  border-radius: 0.3rem;
}
.song-info {
  flex: 1;
  overflow: hidden; /* 溢出内容隐藏 */
  padding-left: 0.5rem;
}
.song-info > div {
  flex: 1;
  overflow: hidden; /* 溢出内容隐藏 */
  white-space: nowrap; /* 禁止文本换行 */ 
  text-overflow: ellipsis; /* 溢出文本替换为省略号 */
}
.gray-font {
  color: rgb(175, 174, 174);
}
/* 添加歌曲上的提示播放图标 */
.banner::before {
  content: "\e717";
  background-color: white;
  border-radius: 50%;
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  font-family: "iconfont" !important;
  font-size: 1.5rem;
}
</style>