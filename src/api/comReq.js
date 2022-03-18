import axios from 'axios'
function comReq(option) {
  return new Promise((resolve, reject) => {
    const instance1 = axios.create({
      baseURL: 'https://netease-cloud-music-api-gilt-seven.vercel.app',
      method: 'post',
      withCredentials: true,
    });
    let loadinginstace;
    // axios请求拦截器
    instance1.interceptors.request.use(res => {
      // 加上时间戳防止响应缓存数据
      res.params = {
        timestamp: new Date().getTime()
      };
      return res;
    }, err => console.log(err))
    instance1(option)
      .then(res => resolve(res.data))
      .catch(err => reject(err));
  })

}

const encAxios = (function() {
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