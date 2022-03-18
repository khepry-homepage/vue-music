<template>
  <div class="search">
    <label for="search-bar" class="iconfont">&#xe648;</label>
    <input v-model="inputValue" type="text" id="search-bar" autocomplete="off" 
      @input="changeInput"
      @focus="handleFocus"
      @blur="handleBlur">
    <div v-show="show" class="search-item">
      <el-scrollbar>
        <div v-if="!inputValue">
          <h3 class="margin-1">热搜榜</h3>
          <div class="state cursor" v-for="(song, idx) in hotSearch" :key="idx">
            <div class="font-horCenter index margin-1" :class="{'top-three-index': idx < 3}">{{idx + 1}}</div>
            <div class="detail flex-row-vertical-center">
              <div class="overflow-replace-ellipsis">
                <span class="font-horCenter name"
                  :class="{'top-three': idx < 3}">
                  {{song.searchWord}}
                </span>
                <span class="font-horCenter flush-left score">{{song.score}}</span><br/>
                <span class="desc-content">{{song.content}}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <h3 class="margin-1" :class="{'null-result': suggest.keywords && !suggest.keywords.length}" v-show="suggest.keywords">猜你想搜</h3>
          <div class="gray-hover list-row" v-for="keyword in suggest.keywords" :key="keyword">
            <span class="margin-1 font-half">{{keyword}}</span>
          </div>
          <h3 class="margin-1" :class="{'null-result': suggest.songs && !suggest.songs.length}" v-show="suggest.songs">单曲</h3>
          <div class="gray-hover list-row" v-for="song in suggest.songs" 
            :key="song.id"
            @mousedown="playSong(song.id)">
            <span class="margin-1 font-half">{{song.name+(song.alias.length?` (${song.alias})`:'')+' - '+song.artists[0].name}}</span>
          </div>
          <h3 class="margin-1" :class="{'null-result': suggest.artists && !suggest.artists.length}" v-show="suggest.artists">歌手</h3>
          <div class="gray-hover list-row" v-for="artist in suggest.artists" :key="artist.id">
            <span class="margin-1 font-half">{{artist.name}}</span>
          </div>
          <h3 class="margin-1" :class="{'null-result': suggest.albums && !suggest.albums.length}" v-show="suggest.albums">专辑</h3>
          <div class="gray-hover list-row" v-for="album in suggest.albums" :key="album.id">
            <span class="margin-1 font-half">{{album.name+''}}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import {throttle} from '@/lodash.js'
export default {
  name: 'Search',
  components: {},
  props: {},
  data() {
    return {
      show: false,
      inputValue: '',
      hotSearch: null, // Array
      suggest: {
        keywords: null,
        songs: null,
        artists: null,
        albums: null
      }
    };
  },
  watch: {
  },
  computed: {},
  methods: {
    // 按歌曲名前缀是否匹配关键词来过滤结果，并且将歌曲名+歌手名作为关键字，按关键词长度升序排序
    filterByKeyword(target) {
      let mySet = new Set();
      target.some(ele => {
        if (mySet.size >= 10) return true; // 最多取10条搜索关键词
        if (ele.name.startsWith(this.inputValue)) {
          mySet.add(ele.name);
        }
      });
      let result = Array.from(mySet);
      result.sort((a, b) => a.length - b.length);
      return result;
    },
    // 按歌曲名前缀是否匹配关键词来过滤结果
    filterBySong(target) {
      let result = [];
      let cache = new Set();
      target.some(ele => {
        if (cache.size >= 4) return true; // 最多取4条歌曲
        if (!cache.has(ele.name+ele.artists[0].name) && ele.name.startsWith(this.inputValue)) {
          result.push(ele);
          cache.add(ele.name+ele.artists[0].name);
        }
      });
      result.sort((a, b) => a.name.length - b.name.length);
      return result;
    },
    // 按歌手名前缀是否匹配关键词来过滤结果，并按关键词长度升序排序
    filterByArtist(target) {
      let result = [];
      let cache = new Set();
      target.forEach(ele => {
        ele.artists.forEach((artist) => {
          if (!cache.has(artist.name) && artist.name.startsWith(this.inputValue))  {
            result.push(artist);
            cache.add(artist.name)
          }
        }) 
      });
      result.sort((a, b) => a.name.length - b.name.length);
      return result;
    },
    // 按专辑名前缀是否匹配关键词来过滤结果，并按关键词长度升序排序
    filterByAlbum(target) {
      let result = [];
      let ids = new Set();
      target.some(ele => {
        if (ids.size >= 2) return true; // 最多取2条专辑
        if (!ids.has(ele.album.id) && ele.album.name.startsWith(this.inputValue)) {
          result.push(ele.album);
          ids.add(ele.album.id);
        }
      });
      result.sort((a, b) => a.name.length - b.name.length);
      return result;
    },
    changeInput() {
      if (this.inputValue) {
        this.querySearchAsync();
      }
    },
    // 按关键词搜索进行节流优化
    querySearchAsync: throttle(function () {
      this.$comReq({
        url: '/search/sugges',
        data: {
          keywords: this.inputValue
        }
      })
      .then(res => {
        if (res.code !== 200) return;
        let songs = res.result.songs;
        this.suggest.keywords = this.filterByKeyword(songs);
        this.suggest.songs = this.filterBySong(songs);
        this.suggest.artists = this.filterByArtist(songs);
        this.suggest.albums = this.filterByAlbum(songs);
      })
      .catch(err => console.log(err))
    }, 1000),
    handleFocus() {
      this.show = true;
    },
    handleBlur() {
      this.show = false;
    },
    playSong(id) {
      this.$store.commit('updateAudioUrl', {songId: id})
    }
  },
  created() {
    // 获取当日热搜歌曲
    this.$comReq({
      url: '/search/hot/detail'
    })
    .then(res => this.hotSearch = res.data)
    .catch(err => console.log(err))
  },
  mounted() {}
};
</script>
<style scoped>
  .search {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 13rem;
    background: rgb(172, 22, 22);
    height: 2rem;
    border-radius: 1rem;
  }
  #search-bar {
    width: 10rem;
    color: white;
    border: none;
    outline: none;
    background: none;
  }
  .search-item {
    position: absolute;
    top: 4rem;
    width: 20rem;
    height: 30rem;
    background: white;
    border: none;
    border-radius: 0.3rem;
    box-shadow: 0 0 5px rgb(177, 183, 189);
    z-index: 1999;
  }
  /* 前三索引标红 */
  .top-three-index {
    color: red !important;
  }
  .index {
    display: flex;
    align-items: center;
    width: 1rem;
    font-size: 1.5rem;
    color: rgb(177, 183, 189);
  }
  .detail {
    flex: 1;
    overflow: hidden;
    margin-left: 2rem;
  }
  .name {
    color: black;
  }
  .score {
    font-size: 0.8rem;
    color: rgb(179, 179, 179);
  }
  .desc-content {
    font-size: 0.8rem;
    color: rgb(179, 179, 179);
  }
  .state {
    display: flex;
    height: 3rem;
  }
  .state:hover {
    background: rgb(200, 200, 200);
  }
  /* 前三字体加粗 */
  .top-three {
    font-weight: bold;
  }
  .el-scrollbar__view {
    width: 99%;
  }
  .null-result::after {
    content: '（无查询结果）';
    font-size: 1rem;
    color: rgb(200, 200, 200);
  }
</style>