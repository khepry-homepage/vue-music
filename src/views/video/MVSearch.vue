<template>
  <div>
    <el-scrollbar style="height: 100%;"> 
      <div class="box-margin-LR">
        <div class="current-mv-menu">
          <span class="title-tag cursor" @click="jumpCurrentMV">最新MV</span>
          <div>
            <div class="mv-area cursor" @click="changeArea(area)" v-for="area in areas" :key="area">
              <span :class="{'activate-tag': area == activateArea}">{{area}}</span>
            </div>
          </div>     
        </div>
        <div class="current-mv">
          <MVBanner class="mv-banner" v-for="mv in currentMVs" :key="mv.id" :mv="mv">
            <template slot="mv-desc">
              <div class="mv-name cursor">{{mv.name}}</div>
              <div class="mv-artist-name">
                <span class="cursor" v-for="artist in mv.artists" :key="artist.id"
                  @click="routeArtist(artist.id)">
                  {{artist.name}}
                </span> 
              </div>
            </template>  
          </MVBanner>
          <animated-loading :id="this.animateId" :defaultStyle="{width: '1rem', height: '1rem'}" />
        </div>
        <div class="hot-mv-menu">
          <span class="title-tag cursor">热播MV</span>   
        </div>
        <div class="hot-mv">
          <MVBanner class="mv-banner" v-for="mv in hotMVs" :key="mv.id" :mv="mv">
            <template slot="mv-desc">
              <div class="mv-name cursor">{{mv.name}}</div>
              <div class="mv-artist-name">
                <span class="cursor" v-for="artist in mv.artists" :key="artist.id"
                  @click="routeArtist(artist.id)">
                  {{artist.name}}
                </span>  
              </div>
            </template>  
          </MVBanner>
        </div>
      </div>
    </el-scrollbar> 
  </div>
</template>

<script>
import MVBanner from 'artistDetail/MVBanner'
export default {
  name: 'MVSearch',
  components: { MVBanner },
  props: {},
  data() {
    return {
      areas: ['港台', '内地', '欧美', '日本', '韩国'],
      activateArea: '港台',
      currentMVs: [],
      hotMVs: [],
      animateId: new Date().getTime(),
    };
  },
  watch: {},
  computed: {},
  methods: {
    changeArea(area) {
      if (area == this.activateArea)  return;
      this.activateArea = area;
      this.queryCurrentMV(6, { id: this.animateId } )
      .then(res => this.currentMVs = res.data)      
      .catch(err => console.log(err))
    },
    // 请求最新mv，默认6条记录
    queryCurrentMV(limit = 6, { id } = {} ) {
      return this.$comReq({
        url: '/mv/first',
        data: {
          area: this.activateArea,
          limit,
        }
      }, { id })
    },
    // 请求热播mv，默认6条记录
    queryHotMV(limit = 6) {
      return this.$comReq({
        url: '/mv/all',
        data: {
          area: this.activateArea,
          order: '最热',
          limit,
        }
      })
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } )
    },
    jumpCurrentMV() {
      this.$router.push( { name: '全部MV', params: { area: this.activateArea, order: '最新' } } )
    },
    jumpHotMV() {
      this.$router.push( { name: '全部MV', params: { area: this.activateArea, order: '上升最快' } } )
    }
  },
  created() {
    this.$encAxios.all([this.queryCurrentMV(), this.queryHotMV()])
    .then(this.$encAxios.spread((res1, res2) => {
      if (res1.code != 200 || res2.code != 200) throw new Error('error in MVSearch component');
      this.currentMVs = res1.data;
      this.hotMVs = res2.data;
    }))
    .catch(err => console.log(err))
  },
  mounted() {}
};
</script>
<style scoped>
.title-tag {
  font-weight: bold;
}
.title-tag::after {
  font-family: "iconfont" !important;
  margin-left: 0.5rem;
  width: 1rem;
  height: 1rem;
  content: "\e625"
}
.current-mv-menu, .hot-mv-menu {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.current-mv-menu > span, .hot-mv-menu > span {
  font-size: 1.5rem;
}
.mv-area {
  display: inline-flex;
  align-items: center;
  padding: 0 0.5rem;
}
.mv-area:nth-child(n + 2) {
  border-left: 1px solid gray;
}
.mv-area > span {
  padding: 0.3rem 0.5rem;
  border-radius: 0.8rem;
}
.mv-area > span:hover {
  color: black;
}
.current-mv-menu > div > span {
  border-radius: 0.3rem;
  padding: 0.3rem 0.5rem;
}
.mv-name, .mv-artist-name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mv-artist-name > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
}
.mv-name:hover, .mv-artist-name:hover {
  color:black;
}
.current-mv, .hot-mv {
  position: relative;
  display: flex;
  flex-wrap: wrap;
}
.current-mv > .mv-banner, .hot-mv > .mv-banner {
  flex: 0 1 calc((100% - 2rem) / 3);
  width: 0;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.current-mv > div:nth-child(3n), .hot-mv > div:nth-child(3n) {
  margin-right: 0;
}
</style>