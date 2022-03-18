<template>
  <div class="music-main">
    <Nav class="nav-bar" />  
    <router-view class="content-show"></router-view>
  </div>
</template>
<script>
import Nav from 'components/Nav'
import Discover from 'discover/Discover'
import PlayListView from 'components/PlayListView'
export default {
  name: 'Main',
  components: {
    Nav,
    Discover,
    PlayListView
  }
}
</script>

<style scoped>
  .music-main {
    height: calc(100vh - 10rem);
    display: flex;
    flex-direction: row;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    border-left: 1px solid black;
  }
  .nav-bar {
    flex: 1 1 20%;
    border-right: 0.1rem solid gray;
  }
  .content-show {
    min-width: 0; /* 防止弹性布局子内容过多将布局撑开，不知道为什么 */
    flex: 4 4 80%;
  }
</style>