<template>
  <div class="box">
    <el-scrollbar> 
      <div class="top-bar">
        <div class="playlist-desc">
          <img class="playlist-cover cursor" :src="playlist.coverImgUrl" alt="">
          <div class="details">
            <h2>{{playlist.name}}</h2>
            <div class="creator">
              <img class="creator-avatar" :src="!playlist.creator || playlist.creator.avatarUrl" alt="">
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
            <div class="desc-info" ref="descInfo" :style="{'white-space': `${isExpand?'pre-wrap':'nowrap'}`}">
              <span>标签&thinsp;:&thinsp;<span v-for="(tag, idx) in playlist.tags" 
                  :key="tag">{{tag + (idx!=playlist.tags.length-1 ? ' / ':'')}}</span>
                </span>
              <br/>
              <span>歌曲&thinsp;:&thinsp;{{playlist.trackCount}}&emsp;播放&thinsp;:&thinsp;{{!playlist.playCount || playlist.playCount.FormatCH()}} <br/></span>
              <span>简介&thinsp;:&thinsp;{{playlist.description}}</span>
            </div>
          </div>
          <span v-if="isHidden" @click="handleExpand" class="iconfont cursor desc-expand">
            {{isExpand ? '&#xe628;':'&#xe65c;'}}
          </span>
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
              <span class="iconfont cursor" @click="handleLove(scope.row)">{{scope.row.isLike?'&#xe85c;':'&#xe643;'}}&emsp;</span>
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
                <span class="iconfont" :style="{'font-size':'1.5rem'}">{{(scope.row.fee===0||scope.row.fee===8)?'&#xe614;':''}}</span>
                <span class="iconfont cursor" :style="{'font-size':'1.5rem'}">{{scope.row.mv?'&#xe62c;':''}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ar[0].name"
            label="歌手"
            sortable
            :show-overflow-tooltip='true'
            :class-name="'cursor'">
          </el-table-column>
          <el-table-column
            prop="al.name"
            label="专辑"
            sortable
            width="180"
            :show-overflow-tooltip='true'
            :class-name="'cursor'">
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
  </div>
</template>

<script>
export default {
  name: 'PlayListView',
  components: {},
  props: {},
  data() {
    return {
      playlist: {},
      songs: [
        {
            "name": "男孩别哭",
            "id": 25731320,
            "pst": 0,
            "t": 0,
            "ar": [
                {
                    "id": 11830,
                    "name": "海龟先生",
                    "tns": [],
                    "alias": []
                }
            ],
            "isLike": false,
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 34,
            "crbt": null,
            "cf": "",
            "al": {
                "id": 2302169,
                "name": "海龟先生",
                "picUrl": "https://p1.music.126.net/g3iuiLZVhrr_RQjcbBm1ww==/109951166580938676.jpg",
                "tns": [],
                "pic_str": "109951166580938676",
                "pic": 109951166580938670
            },
            "dt": 306906,
            "h": {
                "br": 320000,
                "fid": 0,
                "size": 12278640,
                "vd": -58914
            },
            "m": {
                "br": 192000,
                "fid": 0,
                "size": 7367201,
                "vd": -56327
            },
            "l": {
                "br": 128000,
                "fid": 0,
                "size": 4911482,
                "vd": -54669
            },
            "a": null,
            "cd": "1",
            "no": 7,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mark": 8192,
            "originCoverType": 1,
            "originSongSimpleData": null,
            "tagPicList": null,
            "resourceState": true,
            "version": 34,
            "songJumpInfo": null,
            "entertainmentTags": null,
            "single": 0,
            "noCopyrightRcmd": null,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 22020,
            "publishTime": 1356883200007
        },
        {
            "name": "Watching Me",
            "id": 25888537,
            "pst": 0,
            "t": 0,
            "ar": [
                {
                    "id": 489133,
                    "name": "Barcelona",
                    "tns": [],
                    "alias": []
                }
            ],
            "isLike": true,
            "alia": [],
            "pop": 90,
            "st": 0,
            "rt": "",
            "fee": 0,
            "v": 3,
            "crbt": null,
            "cf": "",
            "al": {
                "id": 2338332,
                "name": "Not Quite Yours",
                "picUrl": "https://p1.music.126.net/8thmNwwMp47UZCGIN5eS9w==/2568459162517758.jpg",
                "tns": [],
                "pic": 2568459162517758
            },
            "dt": 213000,
            "h": {
                "br": 320000,
                "fid": 0,
                "size": 8531780,
                "vd": -16600
            },
            "m": {
                "br": 192000,
                "fid": 0,
                "size": 5119143,
                "vd": -14000
            },
            "l": {
                "br": 128000,
                "fid": 0,
                "size": 3412824,
                "vd": -12700
            },
            "a": null,
            "cd": "1",
            "no": 3,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mark": 262144,
            "originCoverType": 0,
            "originSongSimpleData": null,
            "tagPicList": null,
            "resourceState": true,
            "version": 3,
            "songJumpInfo": null,
            "entertainmentTags": null,
            "single": 0,
            "noCopyrightRcmd": null,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 0,
            "publishTime": 1336406400007
        },
        {
            "name": "Shivers",
            "id": 1885131100,
            "pst": 0,
            "t": 0,
            "ar": [
                {
                    "id": 33184,
                    "name": "Ed Sheeran",
                    "tns": [],
                    "alias": []
                }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 4,
            "v": 6,
            "isLike": false,
            "crbt": null,
            "cf": "",
            "al": {
                "id": 134453600,
                "name": "=",
                "picUrl": "https://p1.music.126.net/kGSU7wbU2-Pd6kXr7ibrZQ==/109951166567793994.jpg",
                "tns": [],
                "pic_str": "109951166567793994",
                "pic": 109951166567794000
            },
            "dt": 207853,
            "h": {
                "br": 320000,
                "fid": 0,
                "size": 8316525,
                "vd": -80734
            },
            "m": {
                "br": 192000,
                "fid": 0,
                "size": 4989933,
                "vd": -78255
            },
            "l": {
                "br": 128000,
                "fid": 0,
                "size": 3326637,
                "vd": -76828
            },
            "a": null,
            "cd": "01",
            "no": 2,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mark": 266240,
            "originCoverType": 0,
            "originSongSimpleData": null,
            "tagPicList": null,
            "resourceState": true,
            "version": 6,
            "songJumpInfo": null,
            "entertainmentTags": null,
            "single": 0,
            "noCopyrightRcmd": null,
            "mv": 14315635,
            "rtype": 0,
            "rurl": null,
            "mst": 9,
            "cp": 7002,
            "publishTime": 1635436800000
        }
      ],
      privilieges: [
        {
            "id": 347230,
            "fee": 0,
            "payed": 0,
            "st": -100,
            "pl": 0,
            "dl": 0,
            "sp": 7,
            "cp": 0,
            "subp": 0,
            "cs": false,
            "maxbr": 999000,
            "fl": 0,
            "toast": false,
            "flag": 4,
            "preSell": false,
            "playMaxbr": 999000,
            "downloadMaxbr": 999000,
            "rscl": 0,
            "freeTrialPrivilege": {
                "resConsumable": false,
                "userConsumable": false
            },
            "chargeInfoList": [
                {
                    "rate": 128000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                },
                {
                    "rate": 192000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                },
                {
                    "rate": 320000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                },
                {
                    "rate": 999000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                }
            ]
        },
        {
            "id": 25731320,
            "fee": 0,
            "payed": 0,
            "st": -100,
            "pl": 0,
            "dl": 0,
            "sp": 7,
            "cp": 1,
            "subp": 1,
            "cs": false,
            "maxbr": 999000,
            "fl": 0,
            "toast": false,
            "flag": 4,
            "preSell": false,
            "playMaxbr": 999000,
            "downloadMaxbr": 999000,
            "rscl": 0,
            "freeTrialPrivilege": {
                "resConsumable": false,
                "userConsumable": false
            },
            "chargeInfoList": [
                {
                    "rate": 128000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 0
                },
                {
                    "rate": 192000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                },
                {
                    "rate": 320000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                },
                {
                    "rate": 999000,
                    "chargeUrl": null,
                    "chargeMessage": null,
                    "chargeType": 1
                }
            ]
        }
      ],
      currentRow: null,
      isHidden: false,
      isExpand: false,
      hasUrl: false
    }
  },
  props: {
    id: {
      require: true
    }
  },
  watch: {},
  computed: {
  },
  methods: {
    // 获取歌单详情
    queryPlaylistDeatil(id) {
      return this.$comReq({
        url: '/playlist/detail',
        data: {
          id
        }
      })
    },
    // 获取歌单所有歌曲
    queryPlaylistTrackAll(id) {
      return this.$comReq({
        url: '/playlist/track/all',
        data: {
          id
        }
      })
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
      if (confirm('播放全部歌曲会替换现有播放列表，确认替换?')) {
        let ids = this.songs.map(song => song.id).join(',');
        if (!this.hasUrl) {
          try {
            await  this.$comReq({
              url: 'song/url',
              data: {
                id: ids
              }
            })
            .then(res => {
              if (res.code !== 200) throw new Error('happen error in request: song/url');
              let songsUrl = res.data.sort((s1, s2) => s1.id - s2.id);
              let index = 0;
              this.songs.some(song => {
                if (index >= song.length) return true;
                if (song.id === songsUrl[index].id) {
                  song.url = songsUrl[index].url;
                  ++index;
                }
              })
              this.hasUrl = true; // true: 已缓存url false: 未请求过url
            })   
          } catch (error) {
            return error;
          }
        }
        this.$store.dispatch('addAllToList', {songs: this.songs});
      }      
    },
    handleDbClick(row, column, cell, event) {
      // console.log(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    handleExpand() {
      this.isExpand = !this.isExpand;
    },
    handleLove(row) {
      row.isLike = !row.isLike;
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
    }))
  },
  mounted() {
    if (this.$refs.descInfo.scrollWidth > this.$refs.descInfo.clientWidth)  this.isHidden = true;
  }
};
</script>
<style scoped>
  /* 修改el-table选中某行的背景色 */
  ::v-deep .el-table__body tr.current-row>td {
    background: rgb(209, 209, 209)!important;
  }
  .box {
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
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .desc-expand {
    position: absolute;
    right: 1rem;
    top: 14rem;
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
</style>