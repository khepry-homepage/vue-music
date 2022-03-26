import Vue from 'vue'
import App from './App.vue'
import Fade from 'components/Fade.vue'
import 'assets/iconfont.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {comReq, encAxios} from 'api/index.js'
// 导入unicode符号
import 'assets/iconfont.css' 
import store from 'store/index.js'
import router from 'router/index.js'
import plugins from './plugins.js'

import Loading from 'components/Loading'
Vue.config.productionTip = false;
Vue.prototype.$comReq = comReq;
Vue.prototype.$encAxios = encAxios;
Vue.use(ElementUI);
Vue.use(plugins);
Vue.component('animated-loading', Loading)
Vue.component('animated-fade', Fade)

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
