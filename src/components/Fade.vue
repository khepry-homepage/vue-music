<template>
  <transition name="fade" mode="out-in">
    <slot v-if="show"></slot>
  </transition>
</template>
<script>
export default {
  name: 'animated-fade',
  props: {
    show: {
      require: true
    }
  },
};
</script>
<style scoped>
.fade-leave-active {
  transition: opacity 1s;
}
.fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>