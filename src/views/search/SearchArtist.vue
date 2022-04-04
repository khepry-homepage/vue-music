<template>
  <div>
    <div class="artist" v-for="artist in artists" :key="artist.id + artist.name" @click="routeArtist(artist.id)">
      <img class="cursor" v-lazy="artist.picUrl" alt="">
      <div>
        <span class="artist-name cursor">
          <span :class="{'blue-font': keyword.includes(ch)}" v-for="(ch, index) in artist.name" :key="index">{{ch}}</span>
        </span>
        <span class="addition-font" v-show="artist.alias.length">（{{artist.alias[0]}}）</span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/lodash'
export default {
  name: 'SearchArtist',
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
      artists: []
    }
  },
  methods: {
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } );
    },
    queryArtist( {limit = 20, offset = 0, id} = {} ) {
      return this.$comReq({
        url: '/search',
        data: {
          keywords: this.keyword,
          type: 100,
          limit,
          offset
        }
      }, { id } )
    },
    getScrollHeight: debounce(function () {     
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;  
      let offset = this.artists.length;
      this.queryArtist({offset, limit: 10})
      .then(res => {
        if (res.result.artists && res.result.artists.length) {
          this.artists = this.artists.concat(res.result.artists);
        }
      })
      .catch(err => console.log(err))
    }, 2000),    
  },
  created() {
    this.queryArtist( {id: this.animateId} )
    .then(res => this.artists = res.result.artists )
    .catch(err => console.log(err))
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  },
};
</script>
<style scoped>
.artist {
  display: flex;
  align-items: center;
  height: 5rem;
}
.artist > img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
.artist > div {
  display: flex;
  align-items: center;
}
.artist:nth-child(2n) {
  background: rgb(243, 241, 241)!important;
}
.artist:hover{
  background: rgb(209, 209, 209)!important;
}
.artist-name:hover {
  color: black;
}
</style>