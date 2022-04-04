<template>
  <div class="artist-box">
    <el-scrollbar style="height: 100%;"> 
      <div class="top-bar">
        <div class="artist-desc flex-row-vertical-center">
          <div>
            <img v-lazy="artistInfo.cover" alt="">
          </div>  
          <div class="details">        
            <div>
              <h1>{{artistInfo.name}}</h1>
              <span v-for="(alias, index) in artistInfo.transNames" :key="alias">
                {{alias+(index == artistInfo.transNames.length - 1 ? '/' : '')}}
              </span>
            </div>
            <div class="desc-info" ref="descInfo">
              <span>单曲数:{{artistInfo.musicSize}}&emsp;</span>
              <span>专辑数:{{artistInfo.albumSize}}&emsp;</span>
              <span>MV数:{{artistInfo.mvSize}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="navigation flex-row-vertical-center">
        <span class="cursor" v-for="(nav, idx) in navNames" :key="nav"
          :class="{activate: idx == activateIdx}"
          @click="changeNav(idx)">{{nav}}</span>
      </div>
      <router-view :id="artistId"></router-view>
    </el-scrollbar> 
  </div>
</template>

<script>
export default {
  name: 'ArtistInfo',
  components: {},
  props: {
    id: {
      require: true
    },
  },
  data() {
    return {
      artistId: this.id,
      artistInfo: {},
      hotAlbums: [],
      navNames: ['专辑', 'MV', '歌手详情'],
      mvs: [],
      activateIdx: 0,
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 获取歌手详情
    queryArtistDetail() {
      return this.$comReq({
        url: '/artist/detail',
        data: { id: this.id }
      })
    },
    // 获取歌手专辑，默认限制20
    queryArtistAlbum(limit = 20) {
      return this.$comReq({
        url: '/artist/album',
        data: { id: this.id, limit }
      })
    },
    // 获取歌手MV
    queryArtistMV() {
      return this.$comReq({
        url: '/artist/mv',
        data: { id: this.id }
      })
    },
    changeNav(idx) {
      this.activateIdx = idx;
      if (idx == 0) {
        this.$router.push( { name: '专辑', params: { hotAlbums: this.hotAlbums } } );
      }
      else if (idx == 1) {
        this.$router.push( { name: 'MV', params: { mvs: this.mvs } } );
      }
      else if (idx == 2) {
        this.$router.push( { name: '歌手详情', params: { desc: this.artistInfo.briefDesc } } );
      }
    },
  },
  created() {
    this.$encAxios.all([this.queryArtistAlbum(), this.queryArtistMV(), this.queryArtistDetail()])
    .then(this.$encAxios.spread((res1, res2, res3) => {
      if (![res1.code, res2.code, res3.code].every(code => code == 200))  throw new Error('invalid data happen in ArtistInfo component');
      this.hotAlbums = res1.hotAlbums;
      this.mvs = res2.mvs;
      this.artistInfo = res3.data.artist;
      // 默认导航到名为专辑的路由
      this.$router.push( { name: '专辑', params: { hotAlbums: this.hotAlbums } } );
    }))  
    .catch(err => console.log(err))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('setNavigationName', { name: '歌手详情' } );
    })
  }
};
</script>
<style scoped>
.artist-desc {
  height: 16rem;
}
.artist-desc > div:nth-child(1) {
  margin: 2rem 2rem;
  height: 12rem;
}
.navigation {
  height: 2rem;
  margin-bottom: 1rem;
}
.navigation > span {
  display: inline-block;
  margin-left: 2rem;
}
.activate {
  font-size: 1.4em;
  font-weight: bold;
  border-bottom: 0.3em solid red;
}
.navigation > span:hover {
  color: black;
}
.artist-desc > div:nth-child(1), .artist-desc > div:nth-child(1) > img {
  width: 12rem;
  height: 12rem;
  border-radius: 0.5rem;
}
.details {
  margin-left: 1rem;
}
h1 {
  margin: 0 !important;
}
.details > div {
  margin-bottom: 1rem;
}
</style>