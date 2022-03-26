import Vue from 'vue'
import VueRouter from 'vue-router'
import Discover from '../views/discover/Discover'
import Recommend from '../views/discover/recommend/Recommend'
import PlayLists from '../views/discover/playlists/PlayLists'
import ArtistList from '../views/discover/artists/ArtistList'
import NewSongView from '../views/discover/newSongView/NewSongView'
import RankList from '../views/discover/rankList/RankList'
import PlayListView from '../components/PlayListView'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/', redirect: '/discover' },
    { path: '/playlist-view/:id', component: PlayListView, name: '歌单详情', props: true },
    { 
      path: '/discover', component: Discover, name: '主页', redirect: '/discover/recommend',
      children: [
        {
          path: '/discover/recommend', component: Recommend, name: '个性推荐'
        },
        {
          path: '/discover/playlists', component: PlayLists, name: '歌单'
        },
        {
          path: '/discover/ranklist', component: RankList, name: '排行榜'
        },
        {
          path: '/discover/artistlsit', component: ArtistList, name: '歌手'
        },
        {
          path: '/discover/newsongview', component: NewSongView, name: '最新音乐'
        },
      ] 
    },

  ]
})

export default router;