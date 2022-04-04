<template>
  <div>
    <div class="album cursor" v-for="album in albums" :key="album.id" @click="routeAlbum(album.id)">
      <img v-lazy="album.blurPicUrl" alt="">
      <div>
        <span class="album-name">
          <span :class="{'blue-font': keyword.includes(ch)}" v-for="(ch, index) in album.name" :key="index">{{ch}}</span>
        </span>
        <span class="artist-name cursor" @click="routeArtist(album.artist.id)">{{album.artist.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/lodash'
export default {
  name: 'SearchAlbum',
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
      albums: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    routeAlbum(id) {
      this.$router.push( {name:'专辑详情', params: { id }});
    },
    routeArtist(id) {
      this.$router.push( {name:'歌手详情', params: { id }});
    },
    queryAlbum( {limit = 20, offset = 0, id} = {} ) {
      return this.$comReq({
        url: '/search',
        data: {
          keywords: this.keyword,
          type: 10,
          limit,
          offset
        }
      }, { id } )
    },
    getScrollHeight: debounce(function () {     
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;  
      let offset = this.albums.length;
      this.queryAlbum({offset, limit: 10})
      .then(res => {
        if (res.result.albums && res.result.albums.length) {
          this.albums = this.albums.concat(res.result.albums);
        }
      })
      .catch(err => console.log(err))
    }, 2000),   
  },
  created() {
    this.queryAlbum( { id: this.animateId } )
    .then(res => {
      if (res.code != 200)  throw new Error('error in request album data');
      this.albums = res.result.albums;
    })
    .catch(err => console.log(err))
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  }
};
</script>
<style scoped>
.album {
  display: flex;
  align-items: center;
  height: 5rem;
}
.album > img {
  width: 3rem;
  height: 3rem;
  border-radius: 0.3rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
.album > div {
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
}
.artist-name {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.album:nth-child(2n) {
  background: rgb(243, 241, 241)!important;
}
.album:hover{
  background: rgb(209, 209, 209)!important;
}
.album-name:hover, .artist-name:hover {
  color: black;
}
</style>