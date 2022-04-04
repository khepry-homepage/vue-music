<template>
  <div class="box-margin-LR">      
    <div ref="target" class="banner" >
      <img class="bg-pic" v-lazy="eliteLists[0].coverImgUrl" alt="">
      <img class="pic" v-lazy="eliteLists[0].coverImgUrl" alt="">
      <div class="desc">
        <span class="banner-desc">{{eliteLists[0].name}}</span><br/>
        <span class="extra-desc">{{eliteLists[0].copywriter}}</span>
      </div>
    </div>
    <div class="opt-menu">
      <span class="common-button cursor" @click="isShow = !isShow">{{currCat}}&#xe625;</span>
      <div class="item" v-show="isShow">
        <div class="all-list">
          <span @click="selectTag('全部歌单')" :class="{ 'activate-tag': currCat === '全部歌单' }" class="select-tag cursor">全部歌单</span>
        </div>
        <div>
          <div class="tags-category" v-for="(val, key) in categories" :key="key">
            <div class="category">
              {{val}}
            </div>
            <div class="tags">
              <div @click="selectTag(tag.name)" class="tag" v-for="tag in list[key]" 
                  :key="tag.name">
                <span :class="{ 'activate-tag': currCat === tag.name }" class="select-tag cursor">
                  {{tag.name}}
                </span>
              </div>       
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="playlists">
      <SinglePlayList v-for="(playlist, idx) in playlists" 
        :key="idx" 
        :playlist="playlist">
        <template v-slot:desc>
          <p class="pl-desc">{{playlist.name}}</p>
        </template>
      </SinglePlayList>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="100"
        @current-change="updatePlayLists">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import SinglePlayList from 'components/SinglePlayList'
export default {
  name: 'PlayLists',
  components: {SinglePlayList},
  props: {
    animateId: {
      require: true
    }
  },
  data() {
    return {
      isShow: false,
      currCat: '全部歌单',
      categories: {},
      list: {},
      eliteLists: [{}],
      playlists: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 请求指定类别在不同分页的歌单
    updatePlayLists(offset) {
      this.queryPlayLists(offset)
      .then(res => {
        this.playlists = res.playlists;
        // target父元素滚动条移动到target所在处（置顶）
        this.$refs.target.scrollIntoView();
      })
      .catch(err => console.log(err))
    },
    // 请求指定类别的歌单，默认为50条记录
    queryPlayLists(offset = 0) {
      return this.$comReq({
        url: '/top/playlist',
        data: {
          cat: this.currCat,
          offset
        }
      }, {id: this.animateId})
    },
    // 请求指定类别的精品歌单，默认为50条记录
    quleryElitePlayLists() {
      return this.$comReq({
        url: '/top/playlist/highquality',
        data: {
          cat: this.currCat
        }
      }, {id: this.animateId})
    },
    // 并行请求指定类别的歌单和精品歌单
    queryAllLists() {
      this.$encAxios.all([this.queryPlayLists(), this.quleryElitePlayLists()])
      .then(this.$encAxios.spread((res1, res2) => {
        this.playlists = res1.playlists;
        this.eliteLists = res2.playlists;
      }))
    },
    selectTag(tag) {
      this.currCat = tag;
      this.isShow = false;
      this.queryAllLists();
    }
  },
  created() {
    this.$comReq({
      url: '/playlist/catlist'
    }, {id: this.animateId})
    .then(res => {
      this.categories = res.categories;
      for (let key in res.categories) {
        let parseKey = Number.parseInt(key);
        this.list[key] = res.sub.filter((tag) => {
          return tag.category === parseKey;
        })
      }
    })
    .catch(err => err)
    this.queryAllLists();
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$bus.$emit('setDisMenuName', { name: '歌单' } );
    })   
  }
};
</script>
<style scoped>
.banner {
  position: relative;
  display: flex;
  align-items: center;
  height: 12rem;
  border: 1px solid rgb(136, 136, 136);
  border-radius: 0.3rem;
  overflow: hidden;
}
.banner-desc {
  color: white;
  font-size: 1.5rem;
}
.extra-desc {
  color: rgb(218, 216, 216);
}
.bg-pic {
  position: absolute;
  height: 12rem;
  width: 100%;
  filter: blur(1rem);
  transform: scale(3);
  z-index: -1;
}
.pic {
  width: 10rem;
  height: 10rem;
  margin-left: 1rem;
  border-radius: 0.3rem;
}
.item {
  position: absolute;
  top: 3rem;
  border: 1px solid rgb(212, 212, 212);
  background-color: white;
  box-shadow: 0px 2px 4px darkgray;
  margin-right: 1rem;
  z-index: 1999;
}
.tags-category {
  display: flex;
  margin-top: 1rem;
  margin-left: 1rem;
}
.category {
  flex: 1 1 20%;
  color: rgb(180, 177, 177);
}
.tags {
  flex: 5 5 80%;
} 
.tag {
  display: inline-block;
  width: 8rem;
  height: 2rem;
}
.desc, .tag > span, .all-list > span {
  margin-left: 1rem;
}
.all-list:hover > span, .tag:hover > span {
  color: red;
}
.all-list {
  display: flex;
  height: 3rem;
  align-items: center;
  border-bottom: 1px solid rgb(212, 212, 212);
}
.playlists {
  display: flex;
  flex-wrap: wrap;  /* 自动换行 */
  justify-content: space-between;
}
.playlists > div {
  flex: 0 1 calc((100% - 4rem) / 5); /* 1行显示5列，计算除间距外每个盒子对应宽度 */
  margin-right: 1rem; /* 盒间间距 */
  margin-bottom: 1rem;
}
.playlists > div:nth-child(5n) {
  margin-right: 0 !important;
}
.pl-desc {
  width: 10rem;
  margin: 0.3rem 0 0.3rem 0;
}
.opt-menu {
  margin: 1rem 0 1rem 0;
  position: relative;
}
.opt-menu > span:nth-child(1) {
  display: inline-block;
  text-align: center;
  height: 2rem;
  width: 7rem;
  font-family: "iconfont" !important;
  border-radius: 1rem;
  line-height: 2rem;
  border: 1px solid rgb(197, 197, 197);
  overflow: hidden;
}
.pagination {
  display: flex;
  height: 10rem;
  justify-content: center;
  align-items: center;
}
</style>