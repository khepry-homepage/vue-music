import Vue from 'vue'
import VueRouter from 'vue-router'
const Discover = () => import( '../views/discover/Discover' )
const Recommend = () => import( '../views/discover/recommend/Recommend' )
const PlayLists = () => import( '../views/discover/playlists/PlayLists' )
const ArtistList = () => import( '../views/discover/artists/ArtistList' )
const NewSongView = () => import( '../views/discover/newSongView/NewSongView' )
const RankList = () => import( '../views/discover/rankList/RankList' )
const ArtistInfo = () => import( '../views/artistDetail/ArtistInfo' )
const ArtistDetail = () => import( '../views/artistDetail/ArtistDetail' )
const AlbumList = () => import( '../views/artistDetail/AlbumList' )
const ArtistMV = () => import( '../views/artistDetail/ArtistMV' )
const PlayListView = () => import( '../components/PlayListView' )
const AlbumDetail = () => import( '../views/album/AlbumDetail' )
const MVSearch = () => import( '../views/video/MVSearch' )
const MVList = () => import( '../views/video/MVList' )
const SearchView = () => import( '../views/search/SearchView' )
const SearchSong = () => import( '../views/search/SearchSong' )
const SearchArtist = () => import( '../views/search/SearchArtist' )
const SearchMV = () => import( '../views/search/SearchMV' )
const SearchAlbum = () => import( '../views/search/SearchAlbum' )
const SearchPlaylist = () => import( '../views/search/SearchPlaylist' )
const NotFound = () => import( '../views/NotFound' )

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/', redirect: '/discover' },
    { path: '/404', component: NotFound, name: '404' },
    { path: '/video', component: MVSearch, name: '视频' },
    { path: '/mv-list:area:type:order', component: MVList, name: '全部MV', props: true },
    { path: '/playlist-view/:id', component: PlayListView, name: '歌单详情', props: true },
    { path: '/albumlist-view', component: AlbumDetail, name: '专辑详情', props: true },
    { 
      path: '/artist-view/:id', component: ArtistInfo, name: '歌手主页',  props: true, 
      children: [
        {
          path: '/artist-view/album', component: AlbumList, name: '专辑', props: true
        },
        {
          path: '/artist-view/mv', component: ArtistMV, name: 'MV', props: true
        },
        {
          path: '/artist-view/detail:desc', component: ArtistDetail, name: '歌手详情', props: true
        }
      ]
    },
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
    { 
      path: '/search-view/:keyword:nav', component: SearchView, name: '搜索结果', props: true, 
      children: [
        {
          path: '/search-view/song', component: SearchSong, name: '搜索歌曲结果'
        },
        {
          path: '/search-view/artist', component: SearchArtist, name: '搜索歌手结果'
        },
        {
          path: '/search-view/mv', component: SearchMV, name: '搜索mv结果'
        },
        {
          path: '/search-view/album', component: SearchAlbum, name: '搜索专辑结果'
        },
        {
          path: '/search-view/playlist', component: SearchPlaylist, name: '搜索歌单结果'
        },
      ]
    },
    {
      path: '/:catchAll(.*)', redirect: { name: '404' }
    }
  ]
})

export default router;