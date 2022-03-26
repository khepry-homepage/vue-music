// 处理请求和响应拦截器调度
import requestInterceptor from './request/index.js'
import responseInterceptor from './response/index.js'
import store from 'store/index.js'

const initInterceptors = (instance, {id} = {}) => {
  // 往任务编排队列中添加请求拦截器
  for (let key in requestInterceptor) {
    if (key === 'setLoading') {
      if (id) {
        instance.interceptors.request.use(
          requestInterceptor[key].SUCCESS({id, store}), 
          requestInterceptor[key].ERROR
        )
      }
      continue; // ignore loading animation if id is null
    } 
    instance.interceptors.request.use(
      requestInterceptor[key].SUCCESS, 
      requestInterceptor[key].ERROR
    )
  }

  // 往任务编排队列中添加响应拦截器
  for (let key in responseInterceptor) {
    if (key === 'setLoading') {
      if (id) {
        instance.interceptors.response.use(
          responseInterceptor[key].SUCCESS({id, store}), 
          responseInterceptor[key].ERROR
        )
      }
      continue; // ignore loading animation if id is null
    } 
    instance.interceptors.response.use(
      responseInterceptor[key].SUCCESS, 
      responseInterceptor[key].ERROR
    )
  }
}

export default initInterceptors