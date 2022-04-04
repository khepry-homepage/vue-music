<template>
  <div>
    <div class="header">
      <div class="flex-row-center">
        <div class="song-dish-option">
          <span @click="activateOption = 0" class="cursor" :class="{isActivate: activateOption === 0, unActivate: activateOption !== 0}">新歌速递</span>
          <span @click="activateOption = 1" class="cursor" :class="{isActivate: activateOption === 1, unActivate: activateOption !== 1}">新碟上架</span>
        </div>
      </div>
      <div>
        <span class="tag cursor" 
          :class="{isSelect: activateTag === area}" v-for="(val, area) in areas" 
          :key="area"
          @click="handleChangeTag(area)">
          {{area}}
        </span>
        <div class="operation-bar">
          <button @click="handlePlayAllAsync" class="iconfont common-button cursor play-all">播放全部</button>
          <button class="iconfont common-button cursor collect">收藏全部</button>
        </div>

      </div>
    </div>
    <div class="list">
      <SongRecord v-for="(newsong, index) in newsongs" 
        :key="index" 
        :index="index + 1" 
        :newsong="newsong"
        @click.native="handleClick(index)"
        :class="{'current-row': activateIdx === index}">
      </SongRecord>
    </div>
    <div class="list-box">
      <animated-loading :id="subAnimateId" />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/lodash.js'
import SongRecord from './SongRecord.vue'
export default {
  name: 'NewSongView',
  components: { SongRecord },
  props: {},
  data() {
    return {
      areas: {
        '全部': 0,
        '华语': 7,
        '欧美': 96,
        '韩国': 8,
        '日本': 16,
      },
      activateOption: 0, // 0: 新歌速递 1: 新碟上架
      activateTag: '全部',
      newsongs: null,
      subAnimateId: new Date().getTime(),
      activateIdx: -1,
      songs: null,
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleChangeTag(area) {
      if ( this.activateTag === area ) return;
      this.activateTag = area;
      this.queryNewSongs();
    },
    // 获取歌曲详情
    querySongDeatil(ids) {
      return this.$comReq({
        url: '/song/detail',
        data: {
          ids
        }
      })
    },
    // 获取歌曲url
    querySongUrl(ids) {
      return this.$comReq({
        url: '/song/url',
        data: {
          id: ids
        }
      })
    },
    async handlePlayAllAsync() {
      if (!this.newsongs) return;
      this.$bus.$emit('playAllSongsAsync', { ids: this.newsongs.map(song => song.id).join(',') });
    },
    queryNewSongs: debounce(function () {
      let type = this.areas[this.activateTag];
      this.newsongs = []; // 清空歌手列表
      this.$comReq({
        url: '/top/song',
        data: {
          type,
        }
      }, {id: this.subAnimateId})
      .then(res => this.newsongs = this.newsongs.concat(res.data) )
      .catch(err => console.log(err))
    }, 1000),  
    handleClick(index) {
      this.activateIdx = index;
    },
  },
  created() {
    this.queryNewSongs();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$bus.$emit('setDisMenuName', { name: '最新音乐'} );
    })
  }
};
</script>
<style scoped>
.header {
  height: 8rem;
}
.header > div {
  margin-top: 1rem;
}
.list {
  width: 100%;
}
.list > div:nth-child(1) {
  border-top: 1px solid rgb(216, 214, 214);
}
.list > div {
  border-bottom: 1px solid rgb(216, 214, 214);
}
.song-dish-option {
  display: flex;
  justify-content: center;
  align-items: center;
}
.song-dish-option {
  border-radius: 1rem;
  border: 0.5px solid gray;
}
.song-dish-option > span {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  height: 2rem;
  width: 6rem;

}
.tag {
  display: inline-block;
  margin-left: 1rem;
  color: gray;
}
.tag:hover {
  color: black;
}
.operation-bar {
  float: right
}
.operation-bar > button {
  margin-right: 1rem;
}
.isActivate {
  color: white;
  background: gray;
}
.unActivate:hover {
  background: rgb(224, 224, 224);
}
.isSelect {
  font-weight: bold;
  color: black;
}
.play-all, .collect {
  border-radius: 1rem;
}
.play-all {
  background-color: rgb(235, 81, 81);
  color: white;
}
.play-all:hover {
  background-color: rgb(216, 55, 55)
}
.play-all::before {
  content: "\e717";
}
.collect::before {
  content: "\e8ba";
}
.list-box {
  height: calc(100% - 9rem);
  width: 100%;
  left: 0;
  top: 9rem;
  position: absolute;
  background: none;
  pointer-events: none;
}
</style>