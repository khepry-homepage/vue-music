<template>
  <div>
    <div class="operation-bar">
      <button class="iconfont common-button cursor play-all" @click="handlePlayAllAsync">播放全部</button>
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
      <tr v-for="(song, index) in songs" :key="song.id" @click="playSong(song.id)">
        <td>{{Number(index + 1).FormatSeq()}}</td>
        <td>
          <span class="iconfont cursor" @click.stop="handleLike(song.id)">{{likelist.has(song.id) ? '&#xe85c;' : '&#xe643;'}}</span>
        </td>
        <td class="title">
          <span>
            <span :class="{'blue-font': keyword.includes(ch)}" v-for="(ch, index) in song.name" :key="index">{{ch}}</span>
          </span>
          <span class="iconfont">
            <span class="cursor">{{song.mv != 0 ? '&#xe62c;' : ''}}</span>
            <span>{{(song.fee == 0||song.fee == 8) ? '&#xe614;' : ''}}</span>
          </span>
        </td>
        <td class="artist-name">
          <span class="cursor" @click="routeArtist(artist.id)" v-for="artist in song.artists"
            :key="artist.id" >
            {{artist.name}}
          </span>
        </td>
        <td class="album-name cursor" @click="routeAlbum(song.album.id)">{{ song.album.name }}</td>
        <td class="duration">{{Number(song.duration / 1000).FormatHMS()}}</td>
      </tr>
    </table>    
  </div>
</template>

<script>
import { debounce } from '@/lodash'
export default {
  name: 'SearchSong',
  props: {
    keyword: {
      require: true,
      type: String,
    },
    animateId: {
      require: true,
    }
  },
  data() {
    return {
      songs: [],
      hasUrl: false,
    };
  },
  computed: {
    likelist() {
      return this.$store.state.userInfo.likelist;
    }
  },
  methods: {
    querySong( {offset = 0, limit = 10, id } = {} ) {
      return this.$comReq({
        url: '/search',
        data: {
          keywords: this.keyword,
          type: 1,
          limit,
          offset,
        }        
      }, { id } )
    },
    getScrollHeight: debounce(function () {   
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;
      let offset = this.songs.length;
      this.querySong({offset})
      .then(res => this.songs = this.songs.concat(res.result.songs))
      .catch(err => console.log(err))
    }, 2000),
    handleLike(id) {
      if (this.likelist.has(id))  this.$store.commit('setLikeState', {songId: id, isLike: false});
      else  this.$store.commit('setLikeState', {songId: id, isLike: true});
      this.$forceUpdate();
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手主页', params: { id } } );
    },
    routeAlbum(id) {
      this.$router.push( { name: '专辑详情', params: { id } } );
    },
    playSong: debounce(function(id) { 
      this.$store.commit('updateAudioUrl', { songId: id } );
    }),
    handlePlayAllAsync() {
      this.$bus.$emit('playAllSongsAsync', { ids: this.songs.map(song => song.id).join(',') });
    },
  },
  created() {
    this.querySong( {id: this.animateId})
    .then(res => {
      if (res.code != 200)  throw new Error('error in request songs data');
      this.songs = res.result.songs.sort((s1, s2) => s1.id - s2.id);
    })
    .catch(err => console.log(err))
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  }
};
</script>
<style scoped>
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
.artist-name > span:hover, .album-name:hover {
  color: black;
}
.artist-name > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
}
.operation-bar {
  margin: 1rem 0 1rem 2rem;
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
</style>