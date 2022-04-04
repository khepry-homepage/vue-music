<template>
  <div class="music-footer">
    <div class="song-info flex-row-vertical-center">
      <div class="flex-row-vertical-center">
        <div v-show="this.$store.state.songId" class="banner flex-row-center cursor">
          <img class="song-avatar" v-lazy="info.picUrl" alt="">
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
      isOverflow: false,
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
      this.$store.commit('setLikeState', {songId: this.$store.state.songId, isLike: !this.isLike});
      // 登录后才会同步账号喜欢状态
      if (this.$store.state.isLogin) {
        this.$store.dispatch('updateLikeState');
      }    
    },
    refreshComponent() {
      this.info = this.$options.data().info;
    },
    // 请求歌曲详情
    querySongDetail( { ids } ) {
      return this.$comReq({
        url: '/song/detail',
        data: {
          ids
        }
      })
    },
    // 请求歌曲url
    querySongUrl( { ids } ) {
      return this.$comReq({
        url: '/song/url',
        data: {
          id: ids
        }
      })
    },
    async playAllSongsAsync( { ids } ) {
      if (confirm('播放全部歌曲会替换现有播放列表，确认替换?')) {
        let songs = null;
        await  this.$encAxios.all([this.querySongDetail( { ids } ), this.querySongUrl( { ids } )])
          .then(this.$encAxios.spread((res1, res2) => {
            if (res1.code != 200 || res2.code != 200) throw new Error('happen error in request: song/detail and song/url');
            songs = res1.songs.sort((s1, s2) => s1.id - s2.id);
            let songsUrl = res2.data.sort((s1, s2) => s1.id - s2.id);
            let index = 0;
            songs.some(song => {
              if (index >= song.length) return true;
              if (song.id === songsUrl[index].id) {
                song.url = songsUrl[index].url;
                ++index;
              }
            })
          }))
          .catch(err => console.log(err.message))
        if (songs)  this.$store.dispatch('addAllToList', {songs: songs.filter(song => song.url)});
      }      
    }, 
  },
  components: {
    Audio
  },
  mounted() {
    this.$bus.$on('playAllSongsAsync', this.playAllSongsAsync);
  },
  beforeDestroy() {
    this.$bus.$off('playAllSongsAsync');
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
  position: relative;
  display: flex;
  border: 1px solid black;
  background-color: white;
  z-index: 1999;
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
