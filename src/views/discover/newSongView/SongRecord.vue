<template>
  <div class="song-row gray-hover">
    <div class="index overflow-replace-ellipsis flex-row-center">
      {{normalizedIndex}}
    </div>
    <div class="song-name overflow-replace-ellipsis">
      <SongView :newsong="newsong" :defaultStyle="{width: '100%', height: '4rem'}" :imgSize="{width: '4rem', height: '4rem'}">
        <template v-slot="message">
          <div class="name-alias">
            {{message.ns.name}}
            <span v-if="message.ns.alias.length" class="addition-font">
              （{{message.ns.alias[0]}}）
            </span>
          </div>
        </template>
      </SongView>
    </div>
    <div class="song-artist overflow-replace-ellipsis">
      <span v-for="artist in newsong.artists" 
        :key="artist.id"
        class="info-font cursor"
        @click="routeArtist(artist.id)">
        {{artist.name}}
      </span> 
    </div>
    <div class="song-album overflow-replace-ellipsis">
      <span class="info-font cursor" @click="routeAlbum(newsong.album.id)">{{newsong.album.name}}</span>
    </div>
    <div class="song-duration overflow-replace-ellipsis">
      <span>{{Number(newsong.duration / 1000).FormatHMS()}}</span>
    </div>
  </div>
</template>

<script>
import SongView from 'components/SongView'
export default {
  name: 'SongRecord',
  components: { SongView },
  props: {
    index: {
      require: true
    },
    newsong: {
      require: true
    }
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {
    normalizedIndex() {
      return this.index <= 9 ? `0${this.index}` : this.index.toString();
    }
  },
  methods: {
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } );
    },
    routeAlbum(id) {
      this.$router.push( { name: '专辑详情', params: { id } } );
    }
  },
};
</script>
<style scoped>
.song-row {
  display: flex;
  align-items: center;
  height: 5rem;
  width: 100%;
}
.song-row > div {
  margin-left: 1rem;
}
.song-row:nth-child(2n + 1) {
  background-color: rgb(250, 250, 250);
}
.name-alias {
  max-width: calc(100% - 4rem);
}
.index {
  width: 2rem;
}
.song-duration {
  flex: 1 1 10%;
}
.song-name {
  flex: 5 5 50%;
}
.song-artist, .song-album {
  flex: 2 2 20%;
}
.song-artist > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
}
</style>
