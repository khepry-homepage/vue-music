import initInterceptors from './interceptor/index.js'
import axios from 'axios'
function comReq(option, {id} = {}) {
  return new Promise((resolve, reject) => {
    const instance1 = axios.create({
      baseURL: 'https://netease-cloud-music-api-gilt-seven.vercel.app',
      method: 'post',
      withCredentials: true,
    });
    // axios请求拦截器
    initInterceptors(instance1, {id});
    instance1(option)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  })

}
const encAxios = (function () {
  const instance2 = axios.create({
    baseURL: 'https://netease-cloud-music-api-gilt-seven.vercel.app',
    method: 'post',
    withCredentials: true,
  });  
  instance2.all = axios.all;
  instance2.spread = axios.spread;  
  return instance2;
})()

export {comReq, encAxios}