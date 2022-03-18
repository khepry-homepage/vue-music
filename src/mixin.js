export default {
  data() {
    return {
      forbid: null,
    };
  },
  methods: {
    // 防抖
    debounce(func, wait) {
      console.log(2222)
      return function () {
        if (this.forbid) {
          clearTimeout(this.forbid);
        }
        this.forbid = setTimeout(() => {
          func.apply(this);
        }, wait);
      }
    }
  },
}