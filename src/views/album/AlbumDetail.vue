<template>
  <div v-show="songs.length != 0">
    <el-scrollbar style="height: 100%;"> 
      <div class="top-bar">
        <div>
          <img v-lazy="albumDetail.picUrl" alt="">
        </div>
        <div>
          <h1>{{albumDetail.name}}</h1>
          <div class="operation-bar">
            <button @click="handlePlayAllAsync" class="iconfont common-button cursor play-all">播放全部</button>
            <button class="iconfont common-button cursor collect">收藏{{`(${albumInfo.likedCount})`}}</button>
            <button class="iconfont common-button cursor share">分享{{`(${albumInfo.shareCount})`}}</button>
            <button class="iconfont common-button cursor download-all">下载全部</button>
          </div>
          <div class="artist">歌手:&emsp;
            <span class="cursor" @click="routeArtist(artist.id)" v-for="artist in albumDetail.artists" :key="artist.id">{{artist.name}}</span>
          </div>
          <div>发行时间:&emsp;{{new Date(albumDetail.publishTime).Format('yyyy-MM-dd')}}</div>
        </div>
      </div>
      <table class="list-box">
        <tr>
          <th width="6%"></th>
          <th width="6%"></th>
          <th width="38%">音乐标题</th>
          <th width="20%">歌手</th>
          <th width="20%">专辑</th>
          <th width="10%">时长</th>
        </tr>
        <tr v-for="(song, index) in songs" :key="song.id" @dblclick="handlePlayAllAsync">
          <td>{{Number(index + 1).FormatSeq()}}</td>
          <td>
            <span class="iconfont cursor" @click.stop="handleLike(song.id)">{{likelist.has(song.id) ? '&#xe85c;' : '&#xe643;'}}</span>
          </td>
          <td class="title">
            <span>{{song.name}}</span>
            <span class="iconfont">
              <span class="cursor">{{song.mv != 0 ? '&#xe62c;' : ''}}</span>
              <span>{{(song.fee == 0||song.fee == 8) ? '&#xe614;' : ''}}</span>
            </span>
          </td>
          <td class="artist-name">
            <span class="cursor" @click="routeArtist(artist.id)" v-for="artist in song.ar"
              :key="artist.id" >
              {{artist.name}}
            </span>
          </td>
          <td class="album-name cursor">{{ song.al.name }}</td>
          <td class="duration">{{ Number(song.duration / 1000).FormatHMS() }}</td>
        </tr>
      </table>  

    </el-scrollbar> 
  </div>
</template>

<script>
export default {
  name: 'AlbumDetail',
  components: {},
  props: {
    id: {
      require: true,
    }
  },
  data() {
    return {
    albumInfo: {},
    albumDetail: {},
    songs: [],
    hasUrl: false,
    }
  },
  watch: {},
  computed: {
    likelist() {
      return this.$store.state.userInfo.likelist;
    }
  },
  methods: {
    // 获取专辑内容
    querayAlbumList() {
      return this.$comReq({
        url: '/album',
        data: {
          id: this.id
        }
      })
    },
    // 获取专辑动态信息
    querayAlbumInfo() {
      return this.$comReq({
        url: '/album/detail/dynamic',
        data: {
          id: this.id
        }
      })
    },
    handleLike(id) {
      if (this.likelist.has(id))  this.$store.commit('setLikeState', {songId: id, isLike: false});
      else  this.$store.commit('setLikeState', {songId: id, isLike: true});
      this.$forceUpdate();
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手主页', params: { id } } );
    },
    async handlePlayAllAsync() {
      this.$bus.$emit('playAllSongsAsync', { ids: this.songs.map(song => song.id).join(',') });   
    },
  },
  created() {
    this.$encAxios.all([this.querayAlbumList(), this.querayAlbumInfo()])
    .then(this.$encAxios.spread((res1, res2) => {
      if (res1.code != 200 || res2.code != 200) throw new Error('request error in AlbumDetail component');
      this.albumDetail = res1.album;
      this.songs = res1.songs.sort((s1, s2) => s1.id - s2.id);
      this.albumInfo = res2;
    }))
    .catch(err => console.log(err))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('setNavigationName', { name: '专辑详情' } );
    })
  }
};
</script>
<style scoped>
.top-bar {
  display: flex;
  margin: 2rem 2rem;
}
.top-bar > div:nth-child(1), .top-bar > div:nth-child(1) > img {
  width: 12rem;
  height: 12rem;
  border-radius: 0.5rem;
}
.top-bar > div:nth-child(2) {
  margin-left: 1rem;
  flex: 1 0;
}
.list-box {
  table-layout: fixed;
  border-spacing: 0;
  width: 100%;
}
.list-box > tr {
  height: 3rem;
}
.list-box > tr:nth-child(2) > td {
  border-top: 1px solid rgb(216, 214, 214);
}
.list-box > tr > td {
  border-bottom: 1px solid rgb(216, 214, 214);
}
.list-box > tr:nth-child(1) > th {
  text-align: left;
  color: rgb(170, 170, 170);
}
 
.list-box > tr:nth-child(2n) > td {
  background: rgb(243, 241, 241)!important;
}
.list-box > tr:nth-child(n + 2):hover > td{
  background: rgb(209, 209, 209)!important;
}
/* 第1-2个元素 */
.list-box > tr > td:nth-child(-n + 2) {
  color: gray;
  text-align: center;
}
.list-box > tr > td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title > span:nth-child(1) {
  display: inline-block;
  /* inline-block默认是按baseline对齐，而基线是文本或者无文本时盒子底端，所以为了对齐需要调整垂直对齐方式。top表示文本顶端与行内最高元素顶端对齐 */
  vertical-align: middle;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.title > span:nth-child(2) {
  vertical-align: middle;
}
.artist-name > span:hover {
  color: black;
}
.artist-name > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
}

.operation-bar {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.operation-bar > button {
  margin-right: 1rem;
  height: 2rem;
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
.share::before {
  content: "\e601";
}
.download-all::before {
  content: "\e66c";
}

.artist > span {
  color: rgb(97, 97, 245);
}
.artist > span:hover {
  color: rgb(52, 52, 216);
}
.artist > span:nth-child(n + 2)::before, .artist-name > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
} 

</style>