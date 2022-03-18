<template>
  <div >
    <div>
      <p class="sub-menu gray-hover font-size-nav cursor activate-font" v-for="val in navigations" :key="val"
        :class="{activate: val===isActivate}" @click="changeNav(val)">
        {{val}}
      </p>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Nav',
  data() {
    return {
      navigations: ['发现音乐', '视频', '关注'],
      isActivate: '发现音乐'
    }
  },
  methods: {
    changeNav(val) {
      this.isActivate = val;
    }
  },
}
</script>

<style scoped>
  .sub-menu {
    -webkit-margin-before: 0.5rem;
    padding-left: 0.5rem;
  }
  .activate {
    font-weight: bold;
    font-size: 2rem;
    background: rgb(243, 241, 241);
  }
</style>
