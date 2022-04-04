<template>
  <div class="box">
    <el-scrollbar style="height: 100%;">
      <div class="top-bar">
        <h1 class="search-keyword">搜索&emsp;{{keyword_}}</h1>
        <div class="navigation">
          <router-link v-for="(path, nav) in navs" :key="nav" 
            :to="path" 
            :class="{activate: activateNav == nav}"
            @click.native="changeNav(nav)">{{nav}}</router-link>
        </div>
      </div>
      <router-view :keyword="keyword_" :animateId="this.animateId"></router-view>
      <div class="list-box">
        <animated-loading :id="this.animateId" :defaultStyle="{width: '2rem', height: '2rem'}" />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'SearchView',
  props: {
    keyword: {
      require: true,
      type: String
    },
    nav: {
      default: '单曲',
      type: String
    }
  },
  data() {
    return {
      navs: {
        '单曲': '/search-view/song', 
        '歌手': '/search-view/artist',
        '专辑': '/search-view/album',
        '视频': '/search-view/mv',
        '歌单': '/search-view/playlist'
      },
      activateNav: this.nav,
      keyword_: this.keyword,
      animateId: new Date().getTime(),
    };
  },
  methods: {
    changeNav(nav) {
      this.activateNav = nav;
    }
  },
  beforeRouteEnter (to, from, next) {  
    next((vm) => vm.$router.push( vm.navs[vm.activateNav] ))
  },
  // 当前路由被复用时触发
  beforeRouteUpdate(to, from, next) {     
    if (to.name == '搜索结果') {
      this.$forceUpdate(); 
      this.$nextTick(() => {  
        this.keyword_ = to.params.keyword;
        this.activateNav = to.params.nav;
        this.$router.push(this.navs[this.activateNav]);
      });
    }
    next();
  }
};
</script>
<style scoped>
.box {
  position: relative;
}
.search-keyword {
  margin-top: 1rem;
}
.search-keyword, .navigation > a {
  margin-left: 2rem;
}
.navigation > a {
  color: rgb(43, 43, 43);
  display: inline-block;
  text-decoration: none;
}
.activate {
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 0.3em solid red;
}
.navigation > a:hover {
  color: black;
}
.top-bar {
  height: 9rem;
}
.list-box {
  background: none;
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: calc(100% - 10rem);
  left: 0;
  top: 10rem;
}
</style>