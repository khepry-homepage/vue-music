<template>
  <div class="box">
    <el-scrollbar> 
      <div class="top-bar">
        <div class="playlist-desc">
          <img class="playlist-cover" v-lazy="playlist.coverImgUrl" alt="">
          <div class="details">
            <h2>{{playlist.name}}</h2>
            <div class="creator">
              <img class="creator-avatar" v-lazy="!playlist.creator || playlist.creator.avatarUrl" alt="">
              <span>
                {{(!playlist.creator || playlist.creator.nickname)+'&emsp;'+(!playlist.createTime || new Date(playlist.createTime).Format('yyyy-MM-dd'))+'创建'}}
              </span>
            </div>
            <div class="operation-bar">
              <button @click="handlePlayAllAsync" class="iconfont common-button cursor play-all">播放全部</button>
              <button class="iconfont common-button cursor collect">收藏{{`(${playlist.subscribedCount})`}}</button>
              <button class="iconfont common-button cursor share">分享{{`(${playlist.shareCount})`}}</button>
              <button class="iconfont common-button cursor download-all">下载全部</button>
            </div>
            <!-- 需要判断是否溢出 -->
            <div class="desc-info" :style="{'white-space': `${isExpand?'pre-wrap':'nowrap'}`}">
              <span>标签&thinsp;:&thinsp;
                <span class="tag-name" v-for="tag in playlist.tags" 
                  :key="tag">{{tag}}</span>
              </span>
              <br/>
              <span>歌曲&thinsp;:&thinsp;{{playlist.trackCount}}&emsp;播放&thinsp;:&thinsp;{{!playlist.playCount || playlist.playCount.FormatCH()}} <br/></span>
              <div class="brief-desc-box">
                <span ref="briefDesc" class="brief-desc">简介&thinsp;:&thinsp;{{playlist.description}}</span>
                <span v-show="isOverflow" @click="handleExpand" class="iconfont cursor desc-expand">
                  {{isExpand ? '&#xe628;':'&#xe65c;'}}
                </span>    
              </div>
            </div>
          </div>
        </div>
        <div class="search-bar">
          <h1>歌曲列表</h1>
        </div>
      </div>
      <div class="main">
        <el-table
          :data="songs"
          style="width: 100%"
          :row-key="song => song.id"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @current-change="handleCurrentChange"
          @cell-dblclick="handleDbClick"
          >
          <el-table-column
            type="index"
            :index="indexMethod">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <span class="iconfont cursor" @click="handleLike(scope.row.id)">{{likelist.has(scope.row.id)?'&#xe85c;':'&#xe643;'}}&emsp;</span>
              <span class="iconfont cursor" @click="handleDownload(scope.row)">&#xe66c;</span>
            </template>
          </el-table-column>
          <el-table-column
            label="标题"
            sortable
            :sort-method="sortByName"
            :show-overflow-tooltip='true'>
            <template slot-scope="scope">
              <span>{{scope.row.name}}
                <span class="iconfont" :style="{'font-size':'1rem'}">{{(scope.row.fee===0||scope.row.fee===8)?'&#xe614;':''}}</span>
                <span class="iconfont cursor" :style="{'font-size':'1rem'}">{{scope.row.mv?'&#xe62c;':''}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="歌手"
            sortable
            :show-overflow-tooltip='true'
            :class-name="'cursor'">
            <template slot-scope="scope">
              <span class="artist-name" v-for="artist in scope.row.ar" :key="artist.name" @click="routeArtist(artist.id)">
                {{artist.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="专辑"
            sortable
            width="180"
            :show-overflow-tooltip='true'
            :class-name="'cursor'">
            <template slot-scope="scope">
              <span class="album-name" @click="routeAlbum(scope.row.al.id)">
                {{scope.row.al.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dt"
            label="时间"
            sortable
            :formatter="formatter">
          </el-table-column>
        </el-table>      
      </div>
    </el-scrollbar> 
    <animated-loading :id="this.animateId" :defaultStyle="{width: '2rem', height: '2rem'}" />
  </div>
</template>

<script>
export default {
  name: 'PlayListView',
  components: {},
  data() {
    return {
      animateId: new Date().getTime(),
      playlist: {},
      songs: [],
      privilieges: [],
      currentRow: null,
      isExpand: false,
      hasUrl: false,
      isOverflow: false,
    }
  },
  props: {
    id: {
      require: true
    }
  },
  computed: {
    likelist() {
      return this.$store.state.userInfo.likelist;
    },
  },
  methods: {
    // 获取歌单详情
    queryPlaylistDeatil(id) {
      return this.$comReq({
        url: '/playlist/detail',
        data: {
          id
        }
      }, {id: this.animateId})
    },
    // 获取歌单所有歌曲
    queryPlaylistTrackAll(id) {
      return this.$comReq({
        url: '/playlist/track/all',
        data: {
          id
        }
      }, {id: this.animateId})
    },
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'odd-row';
      }
      return '';
    },
    indexMethod(index) {
      let idx = index + 1;
      return idx < 10 ? `0${idx}` : `${idx}`;
    },
    formatter(row, column, cellValue, index) {
      return (cellValue / 1000).FormatHMS();
    },
    async handlePlayAllAsync() {
      this.$bus.$emit('playAllSongsAsync', { ids: this.songs.map(song => song.id).join(',') });
    },
    handleDbClick(row, column, cell, event) {
      this.handlePlayAllAsync();
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } );
    },
    routeAlbum(id) {  
      this.$router.push( { name: '专辑详情', params: { id } } );
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleExpand() {
      this.isExpand = !this.isExpand;
    },
    handleLike(id) {
      if (this.likelist.has(id))  this.$store.commit('setLikeState', {songId: id, isLike: false});
      else  this.$store.commit('setLikeState', {songId: id, isLike: true});
      this.$forceUpdate();
    },
    handleDownload(row) {
      // console.log(row);
    },
    sortByName(a, b) {
      if (a > b) {
        return 1;
      }
      else if (a < b) {
        return -1;
      }
      return 0;
    }
  },
  created() {
    this.$encAxios.all([this.queryPlaylistDeatil(this.id), this.queryPlaylistTrackAll(this.id)])
    .then(this.$encAxios.spread((res1, res2) => {
      this.playlist = res1.playlist;
      this.songs = res2.songs.sort((s1, s2) => s1.id - s2.id);
      this.$nextTick(() => {
        if (this.$refs.briefDesc.scrollWidth > this.$refs.briefDesc.clientWidth) this.isOverflow = true;
      });
    }))
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.commit('setNavigationName', { name: '歌单详情'} );
    })
  },
};
</script>
<style scoped>
  /* 修改el-table选中某行的背景色 */
  ::v-deep .el-table__body tr.current-row>td {
    background: rgb(209, 209, 209)!important;
  }
  .box {
    position: relative;
    height: calc(100vh - 10rem);
  }
  .el-scrollbar {
    height: 100%;
  }
  .el-scrollbar__view {
    margin-right: 1rem;
  }
  .playlist-desc {
    display: flex;
    flex-direction: row;
    margin-right: 2rem;
  }
  .top-bar {
    margin: 2rem 2rem;
  }
  .playlist-cover {
    width: 14rem;
    height: 14rem;
    border-radius: 0.5rem;
  }
  .creator-avatar {
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
  }
  .creator {
    height: 2rem;
  }
  .creator > span {
    display: inline-block;
    line-height: 1rem;
    transform: translateY(-50%);  /* 上移0.5rem */
  }
  .details {
    margin-left: 1rem;
    flex: 1;
    overflow: hidden;
  }
  .details h2 {
    margin-top: 0;
  }
  .operation-bar {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .operation-bar > button {
    margin-right: 1rem;
    height: 2rem;
    border-radius: 1rem;
  }
  .desc-info {
    text-align: left; /* 文本左对齐 */
  }
  .brief-desc {
    display: inline-block;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .desc-expand {
    vertical-align: top;
  }
  .play-all {
    background-color: rgb(235, 81, 81);
    color: white;
  }
  .play-all:hover {
    background-color: rgb(216, 55, 55)
  }
  .play-all::before {
    content: "\e717";
  }
  .collect::before {
    content: "\e8ba";
  }
  .share::before {
    content: "\e601";
  }
  .download-all::before {
    content: "\e66c";
  }
  .artist-name:hover, .album-name:hover {
    color: black;
  }
  .artist-name:nth-child(n + 2)::before {
    content: ' / ';
    color: black;
  }
  .tag-name:nth-child(n + 2)::before {
    content: ' / ';
    color: black;
  }
</style>