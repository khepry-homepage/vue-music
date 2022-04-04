<template>
  <div>
    <div class="playlist cursor" v-for="playlist in playlists" :key="playlist.id" @click="routePlaylist(playlist.id)">
      <img v-lazy="playlist.coverImgUrl" alt="">
      <div>
        <span class="playlist-name">
          <span :class="{'blue-font': keyword.includes(ch)}" v-for="(ch, index) in playlist.name" :key="index">{{ch}}</span>
        </span>
        <span class="total">{{playlist.track.album.size}}首</span>
        <span class="playCount iconfont">
          &#xe612;<span>{{Number(playlist.playCount).FormatCH()}}</span>
        </span>
        
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/lodash'
export default {
  name: 'SearchPlaylist',
  components: {},
  props: {
    keyword: {
      require: true,
      type: String
    },
    animateId: {
      require: true,
    }
  },
  data() {
    return {
      playlists: []
    };
  },
  methods: {
    routePlaylist(id) {
      this.$router.push( {name:'歌单详情', params: { id }});
    },
    queryPlaylist( {limit = 20, offset = 0, id} = {} ) {
      return this.$comReq({
        url: '/search',
        data: {
          keywords: this.keyword,
          type: 1000,
          limit,
          offset
        }
      }, { id } )
    },
    getScrollHeight: debounce(function () {     
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;  
      let offset = this.playlists.length;
      this.queryPlaylist({offset, limit: 10})
      .then(res => {
        if (res.result.playlists && res.result.playlists.length) {
          this.playlists = this.playlists.concat(res.result.playlists);
        }
      })
      .catch(err => console.log(err))
    }, 2000),   
  },
  created() {
    this.queryPlaylist( {id: this.animateId} )
    .then(res => {
      if (res.code != 200)  throw new Error('error in request playlist data');
      this.playlists = res.result.playlists;
    })
    .catch(err => console.log(err))
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  }
};
</script>
<style scoped>
.playlist {
  display: flex;
  align-items: center;
  height: 5rem;
}
.playlist > img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
.playlist > div {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
}
.total, .playCount {
  position: absolute;
  color: darkgrey;
}
.total, .playCount > span {
  font-size: 0.8rem;
}
.total {
  left: 50%;
}
.playCount {
  left: 90%;
  display: flex;
  align-items: center;
}
.playlist:nth-child(2n) {
  background: rgb(243, 241, 241)!important;
}
.playlist:hover{
  background: rgb(209, 209, 209)!important;
}
.playlist-name:hover {
  color: black;
}
</style>