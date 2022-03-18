import Vue from 'vue'
import Vuex from 'vuex'
import {comReq} from '../api/comReq.js'
import {debounce} from '../lodash.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  state () {
    return {
      songId: null,
      isPlay: false,
      isLike: false,
      isLogin: true,
      playMode: 0, // 播放模式 0: 顺序播放 1: 随机播放 2: 单曲循环播放
      showLoginMenu: false,
      userInfo: {
        account: null,
        profile: null,
        likelist: new Set(),
        playlist: [],
        listIds: new Set()
      }
    }
  },
  mutations: {
    // 设置播放模式 0: 顺序播放 1: 随机播放 2: 单曲循环播放
    setPlayMode(state, {mode}) {
      state.playMode = mode;
    },
    // 清空播放列表
    clearPlaylist(state) {
      state.userInfo.playlist = [];
      state.userInfo.listIds.clear();
      state.songId = null;
      state.isPlay = false;
    },
    // 添加歌曲到播放列表
    updatePlaylist(state, {song, isAdd}) {
      if (isAdd && !state.userInfo.listIds.has(song.id)) {
        state.userInfo.playlist.push(song);
        state.userInfo.listIds.add(song.id);
      }
      // 从播放列表中删除
      else if(!isAdd && state.userInfo.listIds.has(song.id)) {
        state.userInfo.playlist = state.userInfo.playlist.filter(s => s.id !== song.id);
        state.userInfo.listIds.delete(song.id);
      }
    },
    updateAudioUrl(state, {songId}) {
      state.songId = songId;
      state.isLike = state.userInfo.likelist.has(songId)?true:false;
    },
    // 设置歌曲播放状态
    updatePlayState(state, {isPlay}) {
      state.isPlay = isPlay;
    },
    // 设置搜索列表显示状态
    reverseShowLoginMenu(state) {
      state.showLoginMenu = !state.showLoginMenu;
    },
    // 设置登出状态
    setLogoutState(state) {
      state.isLogin = false;
      state.userInfo.account = null;
      state.userInfo.profile = null;  
    },
    // 设置登录状态
    setLoginState(state, {account, profile}) {
      state.userInfo.account = account;
      state.userInfo.profile = profile;          
      state.isLogin = true;
      state.showLoginMenu = false;
    },
    // 修改并更新喜欢状态
    setLikeState(state, {isLike}) {
      // 登录后才能进行添加/取消喜欢操作
      if (state.isLogin) {
        if (isLike) state.userInfo.likelist.add(state.songId);
        else state.userInfo.likelist.delete(state.songId);
      }
      state.isLike = isLike;
    }
  },
  actions: {
    // 获取用户喜欢歌曲列表
    queryLikeList(context, {uid}) {
      return comReq({
        url: '/likelist', 
        data: { uid }
      });
    },
    // 邮箱登录
    login(context, {email, password}) {
      comReq({
        url: '/login',
        data: {
          email,
          password
        }
      })
      .then(res1 => {
        context.dispatch('queryLikeList', {uid: res1.account.id})
        .then(res2 => {
          context.state.userInfo.likelist = new Set(res2.ids);
          context.commit('setLoginState', res1);
        })      
      })
      .catch(err => {throw err;})
    },
    // 退出登录
    logout(context) {
      comReq({
        url: '/logout'
      })
      .then(res => {
        context.commit('setLogoutState')
      })
      .catch(err => console.log(err))
    },
    updateLikeState: debounce(function () {
      let context = this;
      comReq({
        url: '/like',
        data: {
          id: context.state.songId,
          like: context.state.isLike
        }
      })
      .then(res => {
        // 响应非200的状态码表示更新失败，需要把喜欢状态还原，因为该项目先设置本地喜欢状态再向远程同步
        if (res.code !== 200) {
          context.commit('setLikeState', !context.state.isLike);
        }
      })
      // 请求失败，需要把喜欢状态还原，因为该项目先设置本地喜欢状态再向远程同步
      .catch(err => context.commit('setLikeState', !context.state.isLike))
    }, 1000),
    // 添加歌单全部歌曲到播放列表
    addAllToList(context, {songs}) {
      if (!songs) return;
      context.commit('clearPlaylist');
      songs.some(song => {
        context.commit('updatePlaylist', {song, isAdd: true});
      })
      context.commit('updateAudioUrl', {songId: songs[0].id});
    },
    // // 获取用户详情
    // queryUserDetail(context, {id}) {
    //   return comReq({
    //     url: '/user/detail',
    //     data: {
    //       uid: id
    //     }
    //   })
    // },
    // // 获取账号信息
    // queryAccountInfo(context) {
    //   return comReq({
    //     url: '/user/account'
    //   })
    // },
    // // 获取用户全部信息
    // queryUserInfo(context, {id}) {
    //   encAxios.all([
    //     context.dispatch('queryUserDetail',{id}), 
    //     context.dispatch('queryAccountInfo')])
    //   .then(encAxios.spread((res1, res2) => {
    //     context.commit('setLoginState', {
    //       res1,
    //       res2
    //     })
    //   })) 
    // } 
  }
})

export default store;