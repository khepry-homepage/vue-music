<template>
  <div>
    <el-scrollbar ref="scrollRef" style="height: 100%;"> 
      <div class="box-margin-LR">
        <h1>全部MV</h1>
        <div class="area-tag">
          地区:
          <div @click="changeArea(area)" class="tag cursor" v-for="area in areaTag.areas" :key="area">
            <span :class="{'activate-tag': area == areaTag.activateArea}">{{area}}</span>
          </div>
        </div>
        <div class="type-tag">
          类型:
          <div @click="changeType(type)" class="tag cursor" v-for="type in typeTag.types" :key="type">
            <span :class="{'activate-tag': type == typeTag.activateType}">{{type}}</span>
          </div>
        </div>
        <div class="order-tag">
          排序:
          <div @click="changeOrder(order)" class="tag cursor" v-for="order in orderTag.orders" :key="order">
            <span :class="{'activate-tag': order == orderTag.activateOrder}">{{order}}</span>
          </div>
        </div>
        <div class="mv-list">
          <MVBanner class="mv-banner" v-for="mv in mvs" :key="mv.id" :mv="mv">
            <template slot="mv-desc">
              <div class="mv-name cursor">{{mv.name}}</div>
              <div class="mv-artist-name">
                <span class="cursor" v-for="artist in mv.artists" :key="artist.id + mv.name"
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
import { throttle } from '@/lodash'
import MVBanner from 'artistDetail/MVBanner'
export default {
  name: 'MVList',
  components: { MVBanner },
  props: {
    area: {},
    type: {},
    order: {},
  },
  data() {
    return {
      areaTag: {
        activateArea: '全部',
        areas: ['全部', '港台', '内地', '欧美', '日本', '韩国'],
      },
      typeTag: {
        activateType: '全部',
        types: ['全部', '官方版', '原声', '现场版', '网易出品'],        
      },
      orderTag: {
        activateOrder: '上升最快',
        orders: ['上升最快', '最热', '最新'], 
      },
      mvs: []
    };
  },
  methods: {
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } )
    },
    // 请求指定类型mv，默认21条记录
    queryHotMV(limit = 21, offset = 0) {
      return this.$comReq({
        url: '/mv/all',
        data: {
          area: this.areaTag.activateArea,
          type: this.typeTag.activateType,
          order: this.orderTag.activateOrder,
          limit,
          offset,
        }
      })
    },
    changeArea(area) {
      if (this.areaTag.activateArea == area) return;
      this.areaTag.activateArea = area;
      this.queryHotMV()
      .then(res => this.mvs = res.data)
      .catch(err => console.log(err))      
    },
    changeType(type) {
      if (this.typeTag.activateType == type) return;
      this.typeTag.activateType = type;
      this.queryHotMV()
      .then(res => this.mvs = res.data)
      .catch(err => console.log(err))      
    },
    changeOrder(order) {
      if (this.orderTag.activateOrder == order) return;
      this.orderTag.activateOrder = order;
      this.queryHotMV()
      .then(res => this.mvs = res.data)
      .catch(err => console.log(err))      
    },
    getScrollHeight: throttle(function () {      
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;
      let offset = this.mvs.length;
      this.queryHotMV(6, offset)
      .then(res => this.mvs = this.mvs.concat(res.data))
      .catch(err => console.log(err))
    }, 2000),
  },
  created() {
    if (this.area)  this.areaTag.activateArea = this.area;
    if (this.type)  this.typeTag.activateType = this.type;
    if (this.order)  this.orderTag.activateOrder = this.order;
    this.queryHotMV()
    .then(res => this.mvs = res.data)
    .catch(err => console.log(err))
  },
  mounted() {  
    this.$refs.scrollRef['wrap'].onscroll = this.getScrollHeight;
  },
};
</script>
<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  padding: 0 0.5rem;
}
.tag:nth-child(n + 2) {
  border-left: 1px solid gray;
}
.tag > span {
  padding: 0.3rem 0.5rem;
  border-radius: 0.8rem;
}
.tag:hover {
  color: black;
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
.mv-list {
  display: flex;
  flex-wrap: wrap;
}
.mv-list > .mv-banner {
  flex: 0 1 calc((100% - 2rem) / 3);
  width: 0;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.mv-list > div:nth-child(3n) {
  margin-right: 0;
}
.area-tag, .type-tag, .order-tag {
  margin-bottom: 0.5rem;
}
</style>