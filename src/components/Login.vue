<template>
  <div v-if="this.$store.state.showLoginMenu" class="box">
    <div class="triangle cursor" @click="changeLoginMode"></div>
    <h1 class="title">欢迎登录</h1>
    <form class="email-login" v-if="loginMode == 0">
      <div>
        <label for="email" class="login-iconfont cursor">&#xe68b;</label><input type="text" id="email" v-model="form.username" placeholder="邮箱">
      </div>
      <div>
        <label for="password" class="login-iconfont cursor">&#xe679;</label><input type="password" id="password" v-model="form.password" placeholder="密码">
      </div>
      <div class="login-tools">
        <button @click="handleLogin">立即登录</button>
        <animated-fade class="animated-freLogin" :show="showTip"><h3>请不要频繁点击</h3></animated-fade>
      </div>    
    </form>
    <form class="phone-login" v-else>
      <div>
        <label for="phone" class="login-iconfont cursor">&#xeb81;</label><input type="text" id="phone" v-model="form.phoneNumber" placeholder="手机号">
      </div>
      <div class="idt-code">
        <div>
          <input type="text" v-model="form.identifyCode" placeholder="验证码">
        </div>
        <button @click="handleSendCode" :class="{'wait-code': waitCode}">{{!waitCode ? '验证码' : `${timer}s`}}</button>
      </div>
      <div class="login-tools">
        <button @click="handleLogin">立即登录</button>
        <animated-fade class="animated-freLogin" :show="showTip"><h3>请不要频繁点击</h3></animated-fade>
      </div>    
    </form>   
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
        username: '',
        password: '',
        phoneNumber: '',
        identifyCode: '',
      },
      showTip: false,
      waitCode: false,
      timer: 60,
      loginMode: 0, // 0表示邮箱登录, 1表示手机号码登录
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 登录请求进行防抖优化
    handleLogin: debounce(function () {
      try {
        if (this.loginMode == 0 && this.form.username.trim() && this.form.password.trim()) {
          this.$store.dispatch('login', {
            email: this.form.username.trim(),
            password: this.form.password.trim()
          });        
        }
        else if (this.form.phoneNumber.trim() && this.form.identifyCode.trim()) {
          this.$store.dispatch('login', {
            phone: this.form.phoneNumber.trim(),
            captcha: this.form.identifyCode.trim()
          });           
        }
      } catch (err) {
        console.log(err)
      }
    }, 1000, function () {
      this.showTip = true;
      this.$nextTick( () => {this.showTip = false;});  
    }),
    handleSendCode() {
      if (!this.form.phoneNumber.trim()) return;
      this.$comReq({
        url: '/captcha/sent',
        data: {
          phone: this.form.phoneNumber.trim()
        }
      })
        .then(res => {
          if (res.code != 200)  throw new Error('can not send identify code');
            this.waitCode = true;
            let timer = setInterval(() => {
              --this.timer; 
              if (this.timer == 0) {
                clearInterval(timer);
                this.waitCode = false;
                this.timer = 60;     
              }
            }, 1000);
        })
        .catch(err => console.log(err))
    },
    changeLoginMode() {
      this.loginMode  = (this.loginMode + 1) % 2;
    }
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
    flex-direction: column;
    position: fixed;
    width: 20rem;
    height: 20rem;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid darkgrey;
    box-shadow: 0 0 4px darkgrey;
    background-color: #fff;
    border-radius: 0.5rem;
    z-index: 2001;
  }
  .box > form {
    width: 65%;
  }
  .email-login {
    display: flex;
    flex-direction: column;
  }
  .email-login >  div:nth-child(-n + 2), .phone-login >  div:nth-child(1) {
    display: flex;
    align-items: center;
    height: 2rem;
    border: 1px solid darkgrey;
    background-color: rgb(221, 221, 221);
    margin-bottom: 0.5rem;
    border-radius: 0.3rem;
  }
  .box > form >  div:nth-child(-n + 2) > label {
    margin-left: 0.5rem;
  }
  .login-iconfont {
    font-family: 'iconfont' !important;
    font-size: 1.2rem !important;
  }
  /* 修改滑动条默认样式 */
  input {
    width: 100%;
    display: block;
    border: none;
    font-size: 1.2rem;
    background: none;
  }
  /* 去除input聚焦时的边框 */
  input:focus {
    outline: none;
  }
  .login-tools {
    width: 100%;
  }
  .login-tools > button {
    margin-top: 1rem;
    width: 100%;
    font-size: 1.2rem;
    background-color: rgb(92, 92, 206);
    border: none;
    border-radius: 0.3rem;
    color: white;
  }
  .login-tools > button:hover {
    background-color: rgb(81, 81, 202);
  }
  .animated-freLogin {
    position: absolute;
    color: red;
  }
  .title {
    position: absolute;
    top: 1rem;
    font-size: 2rem;
    color: rgb(66, 65, 65);
  }
  .title::before, .title::after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 0.2rem; 
    width: 3rem;
  }
  .title::before {
    background: -webkit-linear-gradient(right, #fff,#474747); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #fff,#474747); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right,#fff,#474747); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #fff,#474747); /* 标准的语法（必须放在最后） */
  }
  .title::after {
    background: -webkit-linear-gradient(left, #fff,#474747); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(left, #fff,#474747); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(left,#fff,#474747); /* Firefox 3.6 - 15 */
    background: linear-gradient(to left, #fff,#474747); /* 标准的语法（必须放在最后） */
  }
  .triangle {
    position: absolute;
    width: 0;
    height: 0;
    top: -0.5rem;
    right: -2rem;
    border-top: 3rem solid rgb(202, 128, 99);
    border-bottom: 0;
    border-left: 3rem solid transparent;
    border-right: 3rem solid transparent;
    transform: rotate(-135deg);
    background-image: url('../assets/phoneIcon.png');
  }
  .idt-code {
    display: flex;
    height: 2rem;
    margin-bottom: 0.5rem;
  }
  .idt-code > div {
    display: flex;
    flex: 1 1 50%;
    align-items: center;
    justify-content: center;
  }
  .idt-code > div:nth-child(1) {
    border-bottom: 1px solid darkgrey;
  }
  .idt-code > button {
    flex: 1 1 50%;
    margin-left: 0.5rem;
    border: 1px solid darkgrey;
    border-radius: 0.3rem;
  } 
  .idt-code > button:hover {
    background-color: rgb(233, 232, 232);
  }
  .email-login {
    display: flex;
    align-items: center;
  }
  .wait-code {
    opacity: 0.5;
    pointer-events: none;
  }
</style>