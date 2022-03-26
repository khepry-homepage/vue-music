<template>
  <div class="audio flex-row-center">
    <div class="audio-progress flex-col-center" :class="{'prevent-events': !this.songId}">
      <div class="flex-row-center">
        <el-tooltip placement="top" effect="dark">
          <div slot="content">
            <span>{{audio.currentMode.modes[mode]}}</span>
          </div>
          <div @click="handleChangeMode" class="play-mode">
            <svg class="icon" aria-hidden="true"><use :xlink:href="audio.currentMode.symbols[mode]"></use></svg>
          </div>
        </el-tooltip>
        <div class="last-one" @click="jump(false)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-music-last"></use></svg>
        </div>
        <div id="play-mode" @click="handleChangeState">
          <svg class="icon" aria-hidden="true"><use :xlink:href="isPlay?'#icon-music-pause':'#icon-music-play'"></use></svg>
        </div>
        <div class="next-one" @click="jump(true)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-music-next"></use></svg>  
        </div>  
      </div>
      <audio ref="audio" 
        :src="audio.srcUrl" 
        id="audio-state"
        @ended="handleEnd"
        @timeupdate="handleTimeUpdate($event)">
      </audio>
      <div class="flex-row-center">
        <span class="current-time">{{formatCur}}</span>
        <div class="progress-bar">
          <input ref="glideBar" type="range" step="1" min="0" :max="audio.duration" id="glide-bar" 
            v-model="audio.currentTime"
            @input="handleChangeInput($event)">
        </div>
        <span class="duration">{{formatDur}}</span>
      </div>
    </div>
    <div class="audio-menu">
      <div v-show="this.$store.state.songId">
        <el-tooltip placement="top" effect="light">
          <div slot="content">
            <el-slider
              v-model="audio.volume"
              vertical
              height="8rem">
            </el-slider>
          </div>
          <span @click="handleMute" class="iconfont cursor menu-icon">{{audio.isMute ? '&#xe673;' : '&#xe672;'}}</span>
        </el-tooltip>
        <span @click="isShowList = !isShowList;" class="iconfont cursor menu-icon">&#xea86;</span>
      </div>    
    </div>
    <div class="playlist" ref="playlist" v-show="isShowList">
      <div class="list-header">
        <h2>当前播放</h2>
        <span>总{{playlist.length}}首</span>
        <span class="clearList cursor" @click="handleClearList">清空列表</span>
      </div>
      <div class="song-list">
        <el-scrollbar style="height: 100%;">
          <el-table
            :data="playlist"
            style="width: 99%"
            :show-header="false"
            :row-key="song => song.id"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @cell-dblclick="handleDbClick"
            >
            <el-table-column :width="36"
              :show-overflow-tooltip='false'>
              <template slot-scope="scope">
                <span v-if="scope.row.id === songId" class="iconfont">{{isPlay?'&#xeae0;':'&#xe615;'}}</span>
              </template>
            </el-table-column>
            <el-table-column :min-width="160">
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content" class="tips">
                    <p>{{scope.row.name}}{{scope.row.tns?`(${scope.row.tns[0]})`:''}}</p>
                  </div>
                  <span class="song-name">
                    <span :class="{'red-font': scope.row.id === songId}">{{scope.row.name}}</span>
                    <span class="addition-font">{{scope.row.tns?`(${scope.row.tns[0]})`:''}}</span>
                  </span>
                </el-tooltip>    
                <span class="iconfont" :style="{'font-size':'1.5rem'}">{{(scope.row.fee===0||scope.row.fee===8)?'&#xe614;':''}}</span>
                <span class="iconfont cursor" :style="{'font-size':'1.5rem'}">{{scope.row.mv?'&#xe62c;':''}}</span>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip='true'>
              <template slot-scope="scope">
                <span class="font-size-08 cursor" 
                :class="{'red-font': scope.row.id === songId}"
                v-for="(value, index) in scope.row.ar" 
                :key="value.id">{{(index?'/':'')+value.name}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="dt"
              width="100"
              :formatter="formatter">
            </el-table-column>
          </el-table>    
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Audio',
  data() {
    return {
      audio: {
        srcUrl: null,
        volume: 100,
        currentTime: 0,
        duration: 0,
        isMute: false,
        currentMode: {
          modes: ['顺序播放', '随机播放', '单曲循环播放'],
          symbols: ['#icon-music-order', '#icon-music-random','#icon-music-repeat']
        }, 
      },
      prevVolume: 100,
      isShowList: false,
      hasBlur: 0, // 0: 未触发blur事件 1: 已先触发blur事件
    }
  },
  props: {
    updateInfo: {
      type: Function,
      require: true
    },
    refreshComponent: {
      type: Function,
      require: true
    }
  },
  computed: {
    mode() {
      return this.$store.state.playMode;
    },
    listIds() {
      return this.$store.state.userInfo.listIds;
    },
    playlist() {
      return this.$store.state.userInfo.playlist;
    },
    isPlay() {
      return this.$store.state.isPlay;
    },
    songId() {
      return this.$store.state.songId;
    },
    formatCur() {
      return Number(this.audio.currentTime).FormatHMS();
    },
    formatDur() {
      return Number(this.audio.duration).FormatHMS();
    }
  },
  watch: {
    songId(newId) {
      // 如果播放列表中有newId对应歌曲的缓冲，直接使用而不请求歌曲详情
      if (this.listIds.has(newId)) {
        let song = this.playlist.filter(s => s.id === newId)[0];
        this.handleUpdateInfo(song);
      }
      else if (newId) {
        this.$encAxios.all([this.querySongDetail(), this.querySongUrl()])
        .then(this.$encAxios.spread((res1, res2) => {
          let song = res1.songs[0];
          song.url = res2.data[0].url;
          this.handleUpdateInfo(song);
        }))
        .catch(err => console.log(err));
      }
    },
    isPlay(newVal) {
      if (!this.$refs.audio.src) return;
      if (newVal) {
        this.$refs.audio.play();
      }
      else {
        this.$refs.audio.pause();
      }
    },
    'audio.volume'(newValue) {
      this.$refs.audio.volume = newValue / 100;
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (rowIndex % 2 === 0) {
        return 'odd-row';
      }
      return '';
    },
    formatter(row, column, cellValue, index) {
      return (cellValue / 1000).FormatHMS();
    },
    handleMute() {
      // 静音
      if (!this.audio.isMute) {
        this.prevVolume = this.audio.volume;
        this.audio.volume = 0;
      }
      else {
        this.audio.volume = this.prevVolume;
      }
      this.audio.isMute = !this.audio.isMute;
    },
    handleChangeState(){
      this.$store.commit('updatePlayState', {isPlay: !this.isPlay});
    },
    handleChangeMode() {
      this.$store.commit('setPlayMode', {mode: (this.mode + 1) % this.audio.currentMode.modes.length});
    },
    jump(isNext, {isRandom} = {isRandom:false}){
      if (this.playlist.length <= 1) return;
      let id;
      let len = this.playlist.length;
      if (!isRandom) {
        this.playlist.some((song, index) => {
          if (song.id === this.songId) {
            id = isNext ? this.playlist.at((index + 1) % len).id : this.playlist.at((index - 1 + len) % len).id;
            return true;
          }
        })
      }
      else {
        let rand = Math.floor(Math.random() * len);
        id = this.playlist.at(rand).id;
      }
      if (id !== this.songId) this.$store.commit('updateAudioUrl', {songId: id});
      else  this.$refs.audio.play();
    },
    querySongDetail() {
      return this.$comReq({
        url: '/song/detail',
        data: {
          ids: `${this.$store.state.songId}`
        }
      })
    },
    querySongUrl() {
      return  this.$comReq({
        url: '/song/url',
        data: {
          id: this.$store.state.songId
        }
      })
    },
    handleUpdateInfo(song) {
      if (!song.url) throw new Error('url invalid');
      this.audio.duration = song.dt / 1000;
      this.audio.srcUrl = song.url; 
      this.$refs.audio.load();
      if (this.isPlay) {
        this.$nextTick(() => this.$refs.audio.play());
      }
      this.updateInfo({song});
    },
    handleClearList() {
      this.$refs.audio.load();
      this.audio = this.$options.data().audio; // 重置data为初始状态数据
      this.$refs.glideBar.style.backgroundSize = 0;
      this.refreshComponent();
      this.$store.commit('clearPlaylist');
    },
    handleDbClick(row) {
      this.$store.commit('updateAudioUrl', {songId: row.id});
    },
    handleChangeInput(event) {
      this.$refs.audio.currentTime = event.target.value;
      event.target.style.backgroundSize = `${100 * event.target.value / event.target.max}%`;
    },
    handleTimeUpdate(event) {
      this.$refs.glideBar.style.backgroundSize = `${100 * event.target.currentTime / this.audio.duration}%`;
      this.audio.currentTime = event.target.currentTime;
    },
    handleEnd() {
      if (this.mode === 0) this.jump(true); // 顺序播放
      else if (this.mode === 1) this.jump(true, {isRandom: true});  // 随机播放
      else if (this.mode === 2) this.$refs.audio.play(); // 单曲循环模式或者播放列表只有一首歌那重新播放
    },
  },
}
</script>

<style scoped>
/* 禁止响应鼠标点击事件 */
.prevent-events {
  pointer-events: none;
  opacity: 0.5;
}
/* 修改el-table选中某行的背景色 */
::v-deep .el-table__body tr.current-row>td {
  background: rgb(209, 209, 209)!important;
}
.audio-progress {
  flex: 7 7 70%;
}
.audio-menu {
  flex: 3 3 30%;
}

.menu-icon {
  font-size: 1.5rem;
  margin-left: 1rem;
}
.play-mode:hover, .last-one:hover, .next-one:hover {
  color: red;
}
#play-mode {
  border-radius: 50%;
  background-color: rgb(230, 224, 224);
}
#play-mode:hover {
  background-color: rgb(202, 202, 202);
}
.audio {
  position: relative;
}
.list-header {
  margin-left: 1rem;
  margin-right: 1rem;
  border-bottom: 1px solid rgb(202, 202, 202);
}
.playlist {
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 30rem;
  top: -1px;
  right: 0;
  height: 40rem;
  transform: translateY(-100%);
  background: white;
  box-shadow: 0 0 4px rgb(202, 202, 202);
}
.song-list {
  flex: 1;
  overflow: hidden;
}
.song-name {
  display: inline-block;
  line-height: 1rem;
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.clearList {
  color:rgb(88, 66, 209);
  float: right;
  clear: both;
}

/*清除原有样式*/
input[type=range] {
  -webkit-appearance: none;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
}
/* 修改滑动条默认样式 */
input[type=range] {
  display: block;
  height: 0.5rem;
  width: 100%;
  margin: 0px;
  border-radius: 0.5rem; /*这个属性设置使填充进度条时的图形为圆角*/
  background: -webkit-linear-gradient(#059cfa, #059cfa) no-repeat;
  background-size: 0% 100%;
}

  
/* 添加滑动条样式 */
input[type="range"]::-webkit-slider-runnable-track {
  border-radius: 0.5rem; /*将轨道设为圆角的*/
}

/* 去除input聚焦时的边框 */
input[type=range]:focus {
  outline: none;
}

.progress-bar {
  width: 50%;
  background: rgb(177, 177, 177);
  border-radius: 0.5rem;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
/* 鼠标移动到滑块上时添加滑块样式并修改进度条高度 */
.progress-bar:hover > input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 0.8rem;
  width: 0.8rem;
  transform: translateX(-50%); /*滑块居中 */
  background: -webkit-linear-gradient(#58bfff, #58bfff) no-repeat;
  border-radius: 50%; /*外观设置为圆形*/
}
.progress-bar:hover > input[type="range"] {
  height: 0.7rem;
}
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.3em;
  fill: currentColor;
  overflow: hidden;
}
</style>