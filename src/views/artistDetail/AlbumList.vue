<template>
  <div>
    <div class="album flex-row-vertical-center" v-for="album in albums" :key="album.id">
      <div class="cursor" @click="routeAlbumDetail(album.id)">
        <img v-lazy="album.blurPicUrl" alt="">
      </div>
      <div>{{album.name}}</div>
      <div>{{album.size}}首</div>
      <div>发行时间:{{new Date(album.publishTime).Format('yyyy-MM-dd')}}</div>
    </div>
  </div>
</template>

<script>
import { throttle } from '@/lodash'
export default {
  name: 'AlbumList',
  components: {},
  props: {
    id: {},
    hotAlbums: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      albums: this.hotAlbums
    } 
  },
  computed: {
    scrollRef() {
      return this.$parent.$refs['wrap'];
    }
  },
  methods: {
    getScrollHeight: throttle(function () {
      if (this.scrollRef.scrollHeight < (this.scrollRef.scrollTop + this.scrollRef.clientHeight - 5)) return;
      let offset = this.albums.length;
      this.$comReq({
        url: '/artist/album',
        data: {
          id: this.id,
          limit: 10,
          offset,
        }
      })
      .then(res => this.albums = this.albums.concat(res.hotAlbums))
      .catch(err => console.log(err))
    }, 2000),
    routeAlbumDetail(id) {
      this.$router.push( { name: '专辑详情', params: { id } } );
    }
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  },
};
</script>
<style scoped>
.album {
  height: 6rem;
}
.album > div:nth-child(1) {
  margin-left: 2rem;
  margin-right: 1rem;
}
.album > div:nth-child(1), .album > div:nth-child(1) > img {
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
}
.album > div:nth-child(n + 2) {
  flex: 1 1 30%;
}
.album:nth-child(2n + 1) {
  background-color: rgb(243, 241, 241)!important;;
}
.album:hover {
  background: rgb(209, 209, 209)!important;
}
</style>