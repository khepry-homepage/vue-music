import Vue from 'vue'
import App from './App.vue'
import Fade from 'components/Fade.vue'
import 'assets/iconfont.js'
import {comReq, encAxios} from 'api/index.js'
// 导入unicode符号
import 'assets/iconfont.css' 
import store from 'store/index.js'
import router from 'router/index.js'
import plugins from './plugins.js'
import Loading from 'components/Loading'

// element-ui按需引入
import elementui from './elementui/index'
Vue.use(elementui);

// 图片懒加载
import VueLazyload from 'vue-lazyload'
const loadimage = require('./assets/loading.gif')
const errorimage = require('./assets/error.jpg')

Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})


Vue.config.productionTip = false;
Vue.prototype.$comReq = comReq;
Vue.prototype.$encAxios = encAxios;
Vue.use(plugins);
Vue.component('animated-loading', Loading)
Vue.component('animated-fade', Fade)

new Vue({
  render: h => h(App),
  store,
  router,
  //注册全局事件总线的标准写法
  beforeCreate(){
    Vue.prototype.$bus = this
  }
}).$mount('#app')
