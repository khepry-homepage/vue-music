<template>
  <div class="audio flex-row-center">
    <div class="audio-progress flex-col-center" :class="{'prevent-events': !this.songId}">
      <div class="flex-row-center">
        <el-tooltip placement="top" effect="dark">
          <div slot="content">
            <span>{{audio.currentMode.modes[mode]}}</span>
          </div>
          <div @click="handleChangeMode" class="play-mode cursor">
            <svg class="icon" aria-hidden="true"><use :xlink:href="audio.currentMode.symbols[mode]"></use></svg>
          </div>
        </el-tooltip>
        <div class="last-one cursor" @click="jump(false)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-music-last"></use></svg>
        </div>
        <div id="play-mode" class="cursor" @click="handleChangeState">
          <svg class="icon" aria-hidden="true"><use :xlink:href="isPlay?'#icon-music-pause':'#icon-music-play'"></use></svg>
        </div>
        <div class="next-one cursor" @click="jump(true)">
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
        <span @click="isShowList = !isShowList" class="iconfont cursor menu-icon">&#xea86;</span>
        <span @click="isShowLyric = !isShowLyric" class="iconfont cursor lyric-show-icon menu-icon" 
          :class="{'show-lyric': isShowLyric}">词</span>
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
            style="width: 100%"
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
    <div class="lyric-panel" v-show="isShowLyric" :class="{'lyric-hover': isLyricHover}"
      @mouseenter="isLyricHover = true"
      @mouseleave="isLyricHover = false">
      <div class="lyric-tools" :class="{'lyric-tools-hidden': !isLyricHover}">
        <span @click="jump(false)" class="iconfont cursor" style="font-size:1.5rem">&#xe921;</span>
        <span @click="handleChangeState" class="iconfont cursor" style="font-size:1.5rem">{{isPlay ? '&#xe750;' : '&#xe87c;'}}</span>
        <span @click="jump(true)" class="iconfont cursor" style="font-size:1.5rem">&#xe8aa;</span>
        <span @click="isShowLyric = false" class="iconfont cursor" style="font-size:1.5rem">&#xe6e9;</span>
      </div>
      <div ref="lyric-text" class="lyric-text cursor">（无）</div>
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
      isShowLyric: false,
      isLyricHover : false,
      hasBlur: 0, // 0: 未触发blur事件 1: 已先触发blur事件
      lyric: null,
      lyricIdx: 0,
      animateInstance: null,
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
        if (this.animateInstance && this.animateInstance.playState == 'paused')  this.animateInstance.play();
      }
      else {
        this.$refs.audio.pause();
        if (this.animateInstance && this.animateInstance.playState == 'running')  this.animateInstance.pause();
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
      if (this.playlist.length < 1) return;
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
    // lrc格式的歌词解析
    parseLrc(lyric) {
      const words = lyric.replace(/\n$/).split(/[\n]/);
      let words1 = words.map(word => {
          const array = [...word.matchAll(/(\[.*\])(.*)/g)][0];
          return {
              text: array[array.length - 1],
              startTime: array[array.length - 2],
          };
      })
      let prev = 0;
      for (let index = words1.length - 1; index >= 0; --index) {
        let str = words1[index].startTime;
        let strArray = str.replace(/[\[\]]/g, '').split(':');
        let st = 0;
        for (let t in strArray) {
          st *= 60;
          st += Number.parseFloat(strArray[t]);
        }
        words1[index].startTime = Math.round(st * 100) / 100; // 保留两位小数
        words1[index].endTime = prev; // bug：api返回歌词时间戳有问题，可能出现endTime < startTime
        words1[index].durationTime = Math.round((words1[index].endTime - words1[index].startTime) * 100) / 100;
        prev = st;
      }
      return words1;
    },
    handleUpdateInfo(song) {
      if (!song.url) throw new Error('url invalid');
      this.$comReq({
        url: '/lyric',
        data: {
          id: song.id
        }
      })
      .then(res => {
        if (res.code != 200)  throw new Error('error in request lyric');
        this.lyric = this.parseLrc(res.lrc.lyric);
        this.lyricIdx = 0;
        this.animateInstance = null;
        this.audio.duration = song.dt / 1000;
        this.audio.srcUrl = song.url; 
        this.$refs.audio.load();
        if (this.isPlay) {
          this.$nextTick(() => this.$refs.audio.play());
        }
        this.updateInfo({song});
      })
      .catch(err => err)
    },
    handleClearList() {
      this.$refs.audio.load();
      this.audio = this.$options.data().audio; // 重置data为初始状态数据
      this.$refs.glideBar.style.backgroundSize = 0;
      this.refreshComponent();
      this.$store.commit('clearPlaylist');
      if (this.animateInstance)  this.animateInstance.cancel();
      this.lyric = null;
      this.$refs['lyric-text'].innerHTML = '（无）';
    },
    handleDbClick(row) {
      this.$store.commit('updateAudioUrl', {songId: row.id});
    },
    handleChangeInput(event) {
      this.$refs.audio.currentTime = event.target.value;
      event.target.style.backgroundSize = `${100 * event.target.value / event.target.max}%`;
      
      for (let i = 0; i < this.lyric.length; ++i) {
        if (this.lyric[i].startTime <= event.target.value && event.target.value <= this.lyric[i].endTime) {
          this.lyricIdx = i;
          if (this.animateInstance)  this.animateInstance.cancel();
          this.$refs['lyric-text'].innerHTML = this.lyric[this.lyricIdx].text;
          this.$refs['lyric-text'].style.backgroundSize = `${100 * (event.target.value - this.lyric[i].startTime) / this.lyric[i].durationTime}%`; 
               
          break;
        }
      }
    },
    handleTimeUpdate(event) {
      // 时间戳校准开始播放歌词动画
      // console.log(event.target.currentTime, this.lyric[this.lyricIdx].startTime);   
      if (!this.isPlay) return;
      if (this.lyric && this.lyricIdx < this.lyric.length) {
        let lyric = this.$refs['lyric-text'];
        if (!this.animateInstance || this.animateInstance.playState == 'finished') {   
          lyric.innerHTML = this.lyric[this.lyricIdx].text == '' ? '（无）' : this.lyric[this.lyricIdx].text; 
          lyric.style.backgroundSize = '0%'; 
        }
        if (event.target.currentTime >= this.lyric[this.lyricIdx].startTime) {
          if (this.lyric[this.lyricIdx].endTime > event.target.currentTime) {
            // 动画播放时间减少0.2s
            let animateDuration = this.lyric[this.lyricIdx].endTime - event.target.currentTime > 0.2 
              ? this.lyric[this.lyricIdx].endTime - event.target.currentTime - 0.2 : 0;
            this.animateInstance = lyric.animate(
            [
              { backgroundSize: this.$refs['lyric-text'].style.backgroundSize},
              { backgroundSize: '100%'},
            ], animateDuration * 1000
            );  
          }
          ++this.lyricIdx;
        }   
      }

      this.$refs.glideBar.style.backgroundSize = `${100 * event.target.currentTime / this.audio.duration}%`;
      this.audio.currentTime = event.target.currentTime;
    },
    handleEnd() {
      if (this.mode == 2 || this.playlist.length == 1) {
        this.$refs.audio.play(); // 单曲循环模式或只有一首歌重新播放
        this.lyricIdx = 0;
      }
      else if (this.mode == 0) this.jump(true); // 顺序播放
      else if (this.mode == 1) this.jump(true, {isRandom: true});  // 随机播放
    },
  },
  mounted() { 
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
  position: fixed;
  right: 0;
  bottom: calc(5rem + 1px);
  width: 30rem;
  height: 30rem;
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
  background: -webkit-linear-gradient(#323333, #343435) no-repeat;
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
  height: 1rem;
  width: 1rem;
  background: url('../assets/slideThumb.jpg') no-repeat center / contain;
  box-shadow: 0 0 1px black;
  border-radius: 0.2rem;
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


.lyric-panel {
  position: fixed;
	left: 50%;
	top: calc(100% - 10rem);
	transform: translateX(-50%);
  border-radius: 0.5rem;
  min-width: 40rem;
  font-size: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
}
.lyric-hover {
  background: rgba(134, 134, 134, 0.8);
  pointer-events: auto;
}
.lyric-tools-hidden {
  visibility: hidden;
}
.lyric-text {
  background-clip: text;
  -webkit-text-stroke: 0.5px darkgrey;  /* 添加文字外沿边框 */
  background: white -webkit-linear-gradient(left, red, red) no-repeat 0 0; /* 初始背景色为白色，并且设置背景图像颜色自左向右渐变 */ 
  -webkit-background-clip: text; /* 背景色只填充文字内容 */
  -webkit-text-fill-color: transparent; /* 文字内容镂空(置透明色) */
  white-space: nowrap;
  text-align: center;
  background-size: 0 100%; /* 初始背景图像宽0、高度100% */
}
.lyric-tools > span {
  margin-right: 1rem;
}
.lyric-tools > span:hover {
  opacity: 0.5;
}
.show-lyric {
  color: red;
}
.lyric-show-icon:hover {
  color: red;
}
</style>