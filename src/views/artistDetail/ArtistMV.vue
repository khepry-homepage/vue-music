<template>
  <div class="mv-list">
    <MVBanner v-for="mv in mvs" :key="mv.id" :mv="mv">
      <template slot="mv-desc">
        <div class="mv-name cursor">
          <div>{{mv.name}}</div>  
          <span>{{mv.name}}</span>
        </div>  
      </template>  
    </MVBanner>
  </div>
</template>

<script>
import MVBanner from './MVBanner.vue'
export default {
  name: 'ArtistMV',
  components: { MVBanner },
  props: {
    mvs: {
      type: Array,
      require: true
    }
  },
};
</script>
<style scoped>

.mv-list {
  display: flex;
  flex-wrap: wrap;
  width: calc(100% - 4rem);
  margin-left: 2rem;
  margin-right: 2rem;
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
.mv-name {
  position: relative;
  width: 100%;
}
.mv-name > div {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;    
}
/* 提示动画 */
.mv-name > span {
  position: absolute;
  opacity: 0;
  transition: opacity 0.5s linear;
  background-color:rgb(253, 232, 193);
  box-shadow: 0 0 5px rgb(53, 52, 52);
  border-radius: 0.3rem;
  left: -2rem;
  top: -2rem;
  z-index: 3;
  white-space: nowrap;  
}
.mv-name:hover > span {
  opacity: 1;
}
</style>