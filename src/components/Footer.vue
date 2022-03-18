<template>
  <div class="music-footer">
    <div class="song-info flex-row-vertical-center">
      <div class="flex-row-vertical-center">
        <div v-show="this.$store.state.songId" class="banner flex-row-center cursor">
          <img class="song-avatar" :src="info.picUrl" alt="">
        </div>
        <div v-show="this.$store.state.songId">
          <div class="flex-row-vertical-center">
            <span ref="animate-box" class="animate-box cursor">
              <span ref="animate-target" :class="{'animate-target': isOverflow}">
                <span>{{info.name}}</span>
                <span v-if="info.alias" class="addition-font">{{'('+info.alias+')'}}</span>
              </span>
            </span>
            <span @click="changeLike" class="iconfont cursor">{{isLike?'&#xe85c;':'&#xe643;'}}</span>
          </div>
          <span class="font-size-08 cursor" v-for="(value, index) in info.artists" 
            :key="value.id">{{(index?'/':'')+value.name}}</span>
        </div>  
      </div>  
    </div>
    <Audio :refreshComponent="refreshComponent" class="audio" :updateInfo="updateInfo" />
  </div>
</template>
<script>
import Audio from './Audio.vue'
export default {
  name: 'Footer',
  data() {
    return {
      info: {
        picUrl: null,
        name: null,
        alias: null,
        artists: null,
      },
      isOverflow: false
    }
  },
  computed: {
    isLike() {
      return this.$store.state.isLike;
    }
  },
  methods: {
    updateInfo({song}) {
      this.info.picUrl = song.al.picUrl;
      this.info.name = song.name;
      this.info.alias = song.tns?song.tns[0]:'';
      this.info.artists = song.ar;
      this.$store.commit('updatePlaylist', {song, isAdd: true}); // 更新当前播放列表
      this.$nextTick(() => {
        this.$store.commit('updatePlayState', {isPlay: true}); // 设置播放状态
        this.isOverflow = this.$refs['animate-box'].offsetWidth < this.$refs['animate-target'].offsetWidth ? true : false;
      });
    },
    changeLike() {
      // 修改本地喜欢状态
      this.$store.commit('setLikeState', {isLike: !this.isLike});
      // 登录后才会同步账号喜欢状态
      if (this.$store.state.isLogin) {
        this.$store.dispatch('updateLikeState');
      }    
    },
    refreshComponent() {
      this.info = this.$options.data().info;
    }
  },
  components: {
    Audio
  },
  mounted() {
    this.$refs['animate-target'].addEventListener('resize', () => {
      console.log(this.$refs['animate-target']);
    })
  }
}
</script>
<style scoped>
/* 若触发overflow则添加循环滚动动画效果 */
.animate-box {
  display: inline-block;
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
}
.animate-box:hover .animate-target {
  display: inline-block;
  animation: 5s wordsLoop linear normal;
}
@keyframes wordsLoop {
  100% {
    transform: translateX(-100%);
  }
}

.music-footer {
  display: flex;
  border: 1px solid black;
}  
.song-info {
  flex: 3 3 30%;
}
.audio {
  flex: 7 7 70%;
}
.banner {
  border: 1px solid rgb(194, 191, 191);
  border-radius: 0.3rem;
  width: 3rem;
  height: 3rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
.song-avatar {
  max-width: 3rem;
  max-height: 3rem;
  border-radius: 0.3rem;
}

</style>
