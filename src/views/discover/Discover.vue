<template>
  <div>
    <div class="menu">
      <router-link
        v-for="(val, key) in submenus" 
        :key="key"
        :to="val"
        :class="{activate: activeMenu === key}" 
        @click.native="handleSelect(key)">
        {{key}} 
      </router-link>       
    </div>
    <div class="box">
      <el-scrollbar>  
        <router-view class="box-margin-LR"> 
        </router-view> 
      </el-scrollbar>  
    </div>
 
  </div>
</template>
<script>
export default {
  name: 'Discover',
  data() {
    return {
      submenus: {
        '个性推荐': '/discover/recommend', 
        '专属订制': '/discover/2', 
        '歌单': '/discover/playlists',
        '排行榜': '/discover/4',
        '歌手': '/discover/5',
        '最新音乐': '/discover/6'
      },
      activeMenu: '个性推荐'
    }
  },
  mounted() {
    if (this.$route.path !== this.submenus[this.activeMenu])  this.$router.push({name: this.activeMenu});
  },
  methods: {
    handleSelect(key) {
      this.activeMenu = key;
    }
  },
}
</script>

<style scoped>
  .menu {
    color: black;
    font-size: 1.3rem;
    height: 4rem;
    padding-top: 1rem;
  }
  .menu > a {
    margin-left: 1rem;
    text-decoration: none; /* 去掉a标签下划线 */
    color: black;
  }
  .activate {
    font-size: 1.4em;
    font-weight: bold;
    border-bottom: 0.3em solid red;
  }
  .box {
    height: calc(100vh - 15rem);
  }
  .box .el-scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>