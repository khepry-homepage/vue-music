<template>
  <div class="box-margin-LR">
    <h1>官方榜</h1>
    <div v-for="list in officialList" :key="list.id"
      class="rank-box flex-row-vertical-center">
      <div class="cover cursor" @click="handleClick(list.id)">
        <img v-lazy="list.coverImgUrl" alt="">
      </div>
      <div class="info-list flex-col-vertical-center">
        <div @dblclick="handlePlayAllAsync(list.id)" class="flex-row-vertical-center" v-for="(track, index) in list.tracks" :key="track.first">
          <span>{{index + 1}}</span>
          <span>{{track.first}}</span>
          <span>{{track.second}}</span>
        </div>
        <span class="cursor" @click="handleViewAll(list.id)">查看全部</span>
      </div>
    </div>
    <h1>全球榜</h1>
    <div class="global-list">
      <SinglePlayList v-for="playlist in globalList" 
        :key="playlist.id" 
        :playlist="playlist">
        <template v-slot:desc>
          <p class="pl-desc">{{playlist.name}}</p>
        </template>
      </SinglePlayList>
    </div>

  </div>
</template>

<script>
import SinglePlayList from 'components/SinglePlayList'
export default {
  name: 'RankList',
  components: { SinglePlayList },
  props: {
    animateId: {
      require: true
    }
  },
  data() {
    return {
      officialList: null,
      globalList: null,
    };
  },
  watch: {},
  computed: {},
  methods: {
    handleClick(id) {
      this.$store.commit('setNavigationName', { name: '歌单详情' });
      this.$router.push( { name: '歌单详情', params: { id } } );
    },
    handleViewAll(id) {
      this.handleClick(id);
    },
    handlePlayAllAsync(id) {
      this.$comReq({
        url: '/playlist/track/all',
        data: {
          id
        }
      })
        .then(res => {
          if (res.code !== 200) throw new Error('happen error in request: /playlist/track/all');
          this.$bus.$emit('playAllSongsAsync', { ids: res.songs.map(song => song.id).join(',') });
        })
        .catch(err => console.log(err))           
    },
  },
  created() {
    this.$comReq({
      url: '/toplist/detail'
    }, { id: this.animateId })
    .then(res => {
      if (res.code !== 200) throw new Error('happen error in request: /toplist/detail');
      this.officialList = res.list.slice(0, 4);
      this.globalList = res.list.slice(4);
    })
    .catch(err => console.log(err))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$bus.$emit('setDisMenuName', { name: '排行榜'} );
    })
  },
};
</script>
<style scoped>
  .rank-box {
    margin-bottom: 3rem;
  }
  .cover, .cover > img {
    position: relative;
    width: 12rem;
    height: 12rem;
    border-radius: 0.5rem;
  }
  .cover:hover::after {
    position: absolute;
    font-family: "iconfont" !important;
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    content: '\e615';
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background-color: rgba(250, 244, 244, 0.979);
    opacity: 80%;
  }
  .info-list {
    margin-left: 1rem;
    height: 12rem;
    position: relative;
  }
  .info-list > div {
    position: relative;
    flex: 1 0;
    border-radius: 0.5rem;
  }
  .info-list > div:hover {
    background: rgb(209, 209, 209)!important;
  }
  .info-list > div:nth-child(2n + 1) {
    background: rgb(243, 241, 241)!important;
  }
  .info-list > span {
    position: absolute;
    top: 100%;
    color: rgb(156, 155, 155);
    left: 0;
  }
  .info-list > span:hover {
    color: black;
  }
  .info-list > div > span {
    display: inline-block;
    font-size: 1rem;
  }
  .info-list > div > span:nth-last-child(n + 2) {
    margin-left: 1rem;
  }
  .info-list > div > span:nth-last-child(1) {
    position: absolute;
    right: 1rem;
  }
  .global-list {
    display: flex;
    flex-wrap: wrap;
  }
  .global-list > div {
    flex: 0 1 calc((100% - 4rem) / 5); /* 1行显示5列，计算除间距外每个盒子对应宽度 */
    margin-right: 1rem; /* 盒间间距 */
    margin-bottom: 1rem;
  }
  .global-list > div:nth-child(5n) {
    margin-right: 0 !important;
  }
</style>