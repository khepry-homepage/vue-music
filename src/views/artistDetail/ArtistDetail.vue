<template>
  <div class="briefDesc">
    {{desc}}
  </div>
</template>

<script>
export default {
  name: 'ArtistDetail',
  components: {},
  props: {
    desc: {
      require: true
    },
  },
  data() {
    return {
    };
  },
};
</script>
<style scoped>
.briefDesc {
  margin-left: 2rem;
  margin-right: 2rem;
  white-space: pre-line; /* 合并空白字符，保留换行符 */
}
</style>