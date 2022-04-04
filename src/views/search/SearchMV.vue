<template>
  <div class="mv-list">
    <MVBanner v-for="mv in mvs" :key="mv.id" :mv="mv">
      <template slot="mv-desc">
        <div class="mv-name cursor">
          <span :class="{'blue-font': keyword.includes(ch)}" v-for="(ch, index) in mv.name" :key="index">{{ch}}</span>
        </div>  
        <div class="mv-artists">
          by 
          <span class="cursor" v-for="artist in mv.artists" :key="artist.id"
            @click="routeArtist(artist.id)">{{artist.name}}</span>
        </div> 
      </template>  
    </MVBanner>
  </div>    
</template>

<script>
import { debounce } from 'lodash'
import MVBanner from 'artistDetail/MVBanner.vue'
export default {
  name: 'SearchMV',
  components: { MVBanner }, 
  props: {
    keyword: {
      require: true,
      type: String
    },
    animateId: {
      require: true,
    }
  },
  data() {
    return {
      mvs: null
    };
  },
  created() {
    this.queryMV( {id: this.animateId} )
    .then(res => this.mvs = res.result.mvs)
    .catch(err => console.log(err))
  },
  methods: {
    // 请求MV，默认请求21条记录
    queryMV( {offset = 0, limit = 21, id} = {} ) {
      return this.$comReq({
        url: '/search',
        data: {
          keywords: this.keyword,
          type: 1004,
          limit,
          offset
        }
      }, { id } )
    },
    routeArtist(id) {
      this.$router.push( { name: '歌手详情', params: { id } } );
    },
    getScrollHeight: debounce(function () {   
      if (this.scrollHeight < (this.scrollTop + this.clientHeight - 5)) return;  
      let offset = this.mvs.length;
      this.queryMV({offset, limit: 10})
      .then(res => {
        if (res.result.mvs) {
          this.mvs = this.mvs.concat(res.result.mvs);
        }
      })
      .catch(err => console.log(err))
    }, 2000),
  },
  mounted() {
    this.$parent.$refs['wrap'].onscroll = this.getScrollHeight;
  },
};
</script>
<style scoped>
.mv-list {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 4rem);
  margin: 2rem 2rem;
}
.mv-list > div {
  flex: 0 1 calc((100% - 2rem) / 3);
  width: 0;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
.mv-list > div:nth-child(3n) {
  margin-right: 0 !important;
}
.mv-name, .mv-artists {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
}
.mv-name:hover, .mv-artists > span:hover {
  color: black;
}
.mv-artists > span:nth-child(n + 2)::before {
  content: ' / ';
  color: black;
} 
</style>