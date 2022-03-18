<template>
  <div v-if="this.$store.state.showLoginMenu" class="box">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="邮箱账号">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">立即登录</el-button>
        <animated-fade class="animated-freLogin" :show="showTip"><h3>请不要频繁点击</h3></animated-fade>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {debounce} from '../lodash.js'
export default {
  name: 'Login',
  components: {},
  props: {},
  data() {
    return {
      form: {
        username: 'suweiyu2022@163.com',
        password: 'Woaiwojia123'
      },
      showTip: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 登录请求进行防抖优化
    handleLogin: debounce(function () {
      try {
        this.$store.dispatch('login', {
          email: this.form.username,
          password: this.form.password
        });
      } catch (err) {
        console.log(err)
      }
    }, 1000, function () {
      this.showTip = true;
      this.$nextTick( () => {this.showTip = false;});  
    })

  },
  created() {},
  mounted() {
  }
};
</script>
<style scoped>
  .box {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 20rem;
    height: 30rem;
    top: 4rem;
    background: white;
    z-index: 1999;
  }
  .animated-freLogin {
    position: absolute;
    color: red;
  }
</style>