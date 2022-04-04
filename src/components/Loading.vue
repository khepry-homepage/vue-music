<template>
  <div v-show="animationIds[this.id] > 0" class="loading">
    <span :style="defaultStyle"></span>
    <span :style="defaultStyle"></span>
    <span :style="defaultStyle"></span>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  computed: {
    animationIds() {
      return this.$store.state.animationIds;
    }
  },
  props: {
    id: {
      require: true
    },
    defaultStyle: {
      type: Object,
      default: function () {
        return { width: '10px', height: '10px' }
      }
    }
  },
};
</script>
<style scoped>
  .loading {
    top: 0;
    left: 0;
    background: white;
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 0;
    color: rgb(22, 184, 97);
    z-index: 1999;
  } 
  
  .loading > span {
    float: none;
    background-color: currentColor;
    border: 0 solid currentColor;
  }  
    
  .loading > span {
    margin: 4px;
    border-radius: 100%;
    animation: ball-beat 0.7s -0.15s infinite linear;
  }
    
  .loading > span:nth-child(2n-1) {
  animation-delay: -0.5s;
  }
  
  @keyframes ball-beat {
  50% {
    opacity: 0.2;
    transform: scale(0.75);
  }
  
  100% {
    opacity: 1;
    transform: scale(1);
  }
  }
</style>