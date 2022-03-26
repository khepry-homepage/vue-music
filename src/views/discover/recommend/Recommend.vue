<template>
  <div class="box-margin-LR">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="(banner, idx) in banners" :key="idx">
        <img class="banner" :src="banner.imageUrl" alt="">
      </el-carousel-item>
    </el-carousel>    
    <h3 class="title-tag">推荐歌单</h3>
    <div class="playlists">
      <SinglePlayList v-for="(playlist, idx) in playlists" 
        :key="idx" 
        :playlist="playlist">
        <template v-slot:desc>
          <p class="pl-desc">{{playlist.name}}</p>
        </template>
      </SinglePlayList>
    </div>
    <h3 class="title-tag">最新音乐</h3>
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
          <div>
            <span v-for="(artist, idx) in message.ns.song.artists" 
              :key="idx"
              class="addition-font">
              {{artist.name + (idx !== message.ns.song.artists.length-1 ? ' / ':'')}}
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
          limit: 8
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
    }
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
    justify-content: space-between;
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
</style>