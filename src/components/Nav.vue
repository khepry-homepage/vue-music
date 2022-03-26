<template>
  <div >
    <div>
      <p class="sub-menu gray-hover font-size-nav cursor activate-font" v-for="(val, key) in navigations" :key="key"
        :class="{activate: key===isActivate}" @click="changeNav(key)">
        {{key}}
      </p>
    </div>

  </div>
</template>
<script>
export default {
  name: 'Nav',
  data() {
    return {
      navigations: {'发现音乐': '/discover',
        '视频': '/discover',
        '关注': '/discover'
      },
    }
  },
  computed: {
    isActivate() {
      return this.$store.state.currNav;
    }
  },
  methods: {
    changeNav(val) {
      if (val === this.isActivate) return;
      this.$store.commit('setNavigationName', { name: val });
      this.$router.push(this.navigations[val]);
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
