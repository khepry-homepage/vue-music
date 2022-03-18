<template>
  <div class="music-header">
    <div class="logo flex-row-center white-font font-size-title cursor">
      {{title}}
    </div>
    <div>
      <Search/>
    </div>
    <div class="avatar">
      <el-avatar :size="30" :src="avatarUrl"></el-avatar>
      <el-dropdown>
        <span @click="showLoginMenu" class="el-dropdown-link white-font cursor">
          {{nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu :class="{hidden: !this.$store.state.isLogin}" slot="dropdown">
          <el-dropdown-item divided>
            <div class="social-connect">
              <div>
                <span class="black-weight">{{eventCount}}</span><br/>
                <span>动态</span>
              </div>
              <div>
                <span class="black-weight">{{follows}}</span><br/>
                <span>关注</span>
              </div>
              <div>
                <span class="black-weight">{{followeds}}</span><br/>
                <span>粉丝</span>
              </div>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided>会员中心</el-dropdown-item>
          <el-dropdown-item divided>等级</el-dropdown-item>
          <el-dropdown-item divided>商城</el-dropdown-item>
          <el-dropdown-item divided>个人信息设置&emsp;&emsp;&emsp;</el-dropdown-item>
          <el-dropdown-item @click.native="handleLogout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
        <Login :class="{hidden: this.$store.state.isLogin}" />
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Login from './Login.vue'
import Search from './Search.vue'
export default {
  name: 'Header',
  components: {Login, Search},
  data() {
    return {
      title: '网易云音乐',
      inputValue: '',
    }
  },
  computed: {
    // 生成多个vuex状态的计算属性
    ...mapState({
      eventCount: state => state.userInfo.profile ? state.userInfo.profile.eventCount : null, // 动态数
      followeds: state => state.userInfo.profile ? state.userInfo.profile.followeds : null, // 粉丝数
      follows: state => state.userInfo.profile ? state.userInfo.profile.follows : null, // 关注数
      nickname: state => state.userInfo.profile ? state.userInfo.profile.nickname : '未登录',
      avatarUrl(state) {
        if (state.userInfo.profile) return state.userInfo.profile.avatarUrl;
        return "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
      },
    })
  },
  mounted() {
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('logout');
    },
    showLoginMenu() {
      if (!this.$store.state.isLogin) this.$store.commit('reverseShowLoginMenu');
    },
  }
}
</script>

<style scoped>
  .hidden {
    display:none;
  }
  .music-header {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(221, 20, 20);
    border: 1px solid black;
  }
  .music-header > div:nth-last-child(n + 2) {
    flex: 1 1 30%;
  }
  .music-header > div:nth-last-child(1) {
    flex: 3 3 40%;
    display: flex;
    align-items: center;
  }
  .social-connect {
    width: 100%;
    display: flex;
  }
  .social-connect div:nth-child(n) {
    flex: 1;
    text-align: center;
    align-items: center;
  }
  .logo::before {
    content: "\e617";
    font-family: "iconfont" !important;
    margin-right: 0.5rem;
  }
</style>