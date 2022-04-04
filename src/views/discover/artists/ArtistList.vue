<template>
  <div class="box-margin-LR">
    <div class="tag-menu">
      <div class="tag-box">
        <div class="tag-category">语种:</div>
        <div class="tags">
          <div class="tag cursor" 
            v-for="(val, key) in areas" :key="key"
            @click="handleSelectArea(key)">
            <span class="select-tag"  :class="{ 'activate-tag': selectTags.areaTag === key }" >{{key}}</span>
          </div>
        </div>
      </div>
      <div class="tag-box">
        <div class="tag-category">分类:</div>
        <div class="tags">
          <div class="tag cursor" 
            v-for="(val, key) in categories" :key="key"
            @click="handleSelectCatergory(key)">
            <span class="select-tag" :class="{ 'activate-tag': selectTags.catTag === key }" >{{key}}</span>  
          </div>
        </div>

      </div>
      <div class="tag-box">
        <div class="tag-category"><span>筛选:</span></div>
        <div class="tags">
          <div class="tag cursor" 
            v-for="val in firstLetters" 
            :key="val"
            @click="handleSelectScreen(val)">
            <span class="select-tag" :class="{ 'activate-tag': selectTags.screenTag == val }" >{{val.toUpperCase()}}</span> 
          </div>
        </div>
      </div>
    </div>
    <div class="ar-list">
      <ArtistAvatar class="ar-avatar" v-for="artist in artists" :key="artist.id" :artist="artist" />
    </div>
    <div class="list-box">
      <animated-loading :id="subAnimateId" />
    </div>
  </div>
</template>

<script>
import { debounce, throttle } from '@/lodash.js'
import ArtistAvatar from './ArtistAvatar'

export default {
  name: 'ArtistList',
  components: {ArtistAvatar},
  props: {
    animateId: {
      require: true
    }
  },
  data() {
    return {
      subAnimateId: new Date().getTime(),
      artists: null,
      areas: {'全部': -1, '华语': 7, '欧美': 96, '日本': 8, '韩国': 16, '其他': 0},
      categories: {'全部': -1, '男歌手': 1, '女歌手': 2, '乐队': 3},
      firstLetters: ['热门', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '#'],
      selectTags: {
        areaTag: '全部',
        catTag: '全部',
        screenTag: '热门'
      }
    };
  },
  watch: {},
  computed: {
    scrollRef() {
      return this.$parent.$refs['wrap'];
    }
  },
  methods: {
    queryArtists: debounce(function () {
      let area = this.areas[this.selectTags.areaTag];
      let type = this.categories[this.selectTags.catTag];
      this.artists = []; // 清空歌手列表
      let initial = this.selectTags.screenTag === '热门' ? -1 : this.selectTags.screenTag === '#' ? 0 : this.selectTags.screenTag;
      this.$comReq({
        url: '/artist/list',
        data: {
          limit: 30,
          offset: 0,
          initial,
          area,
          type,
        }
      }, {id: this.subAnimateId})
      .then(res => this.artists = this.artists.concat(res.artists))
      .catch(err => console.log(err))
    }, 1000),
    getScrollHeight: throttle(function () {   
      if (this.scrollRef.scrollHeight !== (this.scrollRef.scrollTop + this.scrollRef.clientHeight)) return;
      let offset = this.artists.length;
      let initial = this.selectTags.screenTag === '热门' ? -1 : this.selectTags.screenTag === '#' ? 0 : this.selectTags.screenTag;
      this.$comReq({
        url: '/artist/list',
        data: {
          limit: 10,
          offset,
          initial,
          area: this.areas[this.selectTags.areaTag],
          type: this.categories[this.selectTags.catTag],
        }
      })
      .then(res => this.artists = this.artists.concat(res.artists))
      .catch(err => console.log(err))
    }, 2000),
    handleSelectArea (key) {
      if ( this.selectTags.areaTag === key ) return;
      this.selectTags.areaTag = key;
      this.queryArtists();
    },
    handleSelectCatergory (val) {
      if ( this.selectTags.catTag === val ) return;
      this.selectTags.catTag = val;
      this.queryArtists();
    },
    handleSelectScreen (key) {
      if ( this.selectTags.screenTag === key ) return;
      this.selectTags.screenTag = key;
      this.queryArtists();
    }
  },
  created() {
    this.queryArtists();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$bus.$emit('setDisMenuName', { name: '歌手'} );
    })
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  }
};
</script>
<style scoped>
.list-box {
  height: calc(100% - 15rem);
  width: 100%;
  left: 0;
  top: 15rem;
  position: absolute;
  background: none;
  pointer-events: none; /* 解禁当前元素的阻止鼠标事件限制 */
}
.tag-menu {
  height: 15rem;
}
.ar-list {
  display: flex;
  flex-wrap: wrap;
}
.ar-list > .ar-avatar {
  flex: 0 1 calc((100% - 4rem) / 5); /* 1行显示5列，计算除间距外每个盒子对应宽度 */
  margin-right: 1rem; /* 盒间间距 */
  margin-bottom: 1rem;
  /* box-sizing: border-box; 更改盒子模型，width = border + padding + width(原) */
}
.ar-avatar:nth-child(5n) {
  margin-right: 0 !important;
}
.tag-box {
  display: flex;
}
.tag-box > .tag-category {
  width: 3rem;
  color: rgb(180, 177, 177);
}
.tag-box > .tags {
  flex: 1;
}
.tag-category, .tags, .tag {
  display: inline-block;
}
.tag-box > .tags > .tag {
  width: 5rem;
}
.tag {
  text-align: center;
  border-right: 1px solid rgb(202, 202, 202);
  margin-bottom: 1rem;
}
</style>