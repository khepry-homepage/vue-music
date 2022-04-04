<template>
  <div class="box-margin-LR">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(banner, idx) in banners" :key="idx">
        <img class="banner" v-lazy="banner.imageUrl" alt="">
      </el-carousel-item>
    </el-carousel>    
    <h3 class="title-tag cursor" @click="routePlaylist">推荐歌单</h3>
    <div class="playlists">
      <SinglePlayList v-for="(playlist, idx) in playlists" 
        :key="idx" 
        :playlist="playlist">
        <template v-slot:desc>
          <p class="pl-desc">{{playlist.name}}</p>
        </template>
      </SinglePlayList>
    </div>
    <h3 class="title-tag cursor" @click="routeNewSong">最新音乐</h3>
    <div class="newsong">
      <SongView v-for="(newsong, idx) in newsongs" 
        :key="idx" 
        :newsong="newsong" 
        @dblclick.native="handlePlay(newsong.id)"
        @click.native="handleClick(idx)"
        class="single-song"
        :class="{activate: activateIdx === idx}">
        <template v-slot="message">
          <div>{{message.ns.name}}<span v-if="message.ns.song.alias.length" class="addition-font">（{{message.ns.song.alias[0]}}）</span></div>
          <div class="artist-name">
            <span v-for="artist in message.ns.song.artists" 
              :key="artist.id"
              class="cursor addition-font"
              @click="routeArtist(artist.id)">
              {{artist.name}}
            </span>  
          </div>
        </template>
      </SongView>
    </div>
  </div>

</template>

<script>
import SinglePlayList from 'components/SinglePlayList'
import SongView from 'components/SongView'
export default {
  name: 'Recommend',
  data() {
    return {
      banners: new Array(9).fill(''),
      playlists: null,
      newsongs: null,
      activateIdx: null,
    }
  },
  props: {
    animateId: {
      require: true
    }
  },
  created() {
    this.$encAxios.all([this.queryBanner(), this.queryRecommendList(), this.queryNewSong()])
    .then(this.$encAxios.spread((res1, res2, res3) => {
      this.banners = res1.banners;
      this.playlists = res2.result;
      this.newsongs = res3.result;
    }))
    .catch(err => console.log(err));
  },
  components: {SinglePlayList, SongView},
  methods: {
    // 请求需要轮播的海报
    queryBanner() {     
      return this.$comReq({
        url: '/banner',
        data: {
          type: 0
        }
      }, {id: this.animateId})
    },
    // 请求推荐歌单
    queryRecommendList() {
      return  this.$comReq({
        url: '/personalized',
        data: {
          limit: 10
        }
      }, {id: this.animateId})
    },
    // 请求最新音乐
    queryNewSong() {
      return this.$comReq({
        url: '/personalized/newsong',
        data: {
          limit: 12
        }
      }, {id: this.animateId})
    },
    handlePlay(songId) {
      this.$store.commit({
        type: 'updateAudioUrl',
        songId
      })
    },
    handleClick(index) {
      this.activateIdx = index;
    },
    routePlaylist() {
      this.$router.push( { name: '歌单' } );
    },
    routeNewSong() {
      this.$router.push( { name: '最新音乐' } );
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } );
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$bus.$emit('setDisMenuName', { name: '个性推荐'} );
    })
  },
}
</script>

<style scoped>
  .el-carousel__item {
    border-radius: 0.5rem;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .banner {
    width: 100%;
    height: 100%;
  }
  .playlists, .newsong {
    display: flex;
    flex-wrap: wrap;  /* 自动换行 */
  }
  .playlists > div {
    flex: 0 1 calc((100% - 4rem) / 5);
    width: 0;
    margin-right: 1rem;
    margin-bottom: 1rem;
  }
  .playlists > div:nth-child(5n) {
    margin-right: 0;
  }
  .newsong > div {
    flex-basis: 32%;  /* 控制盒子宽度为32%，则盒间间距为2% */
  }
  .single-song {
    margin-bottom: 1rem;
  }
  .single-song:hover, .activate {
    background-color: rgb(236, 233, 233);
  }
  .title-tag::after {
    font-family: "iconfont" !important;
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
    content: "\e625"
  }
  .pl-desc {
    width: 10rem;
    margin: 0.3rem 0 0.3rem 0;
  }
  .artist-name > span:hover {
    color: black;
  }
  .artist-name > span:nth-child(n + 2)::before {
    content: ' / ';
    color: black;
  }
</style>