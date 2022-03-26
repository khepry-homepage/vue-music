const setLoading = ({id, store} = {}) => {
  return function (config) {
    // 添加动画
    if (!id || !store) return;
    store.commit('addAnimateId', id);
    return config;  
  }
}

const setError = error => {
  console.log(error)
}

export default {
  SUCCESS: setLoading,
  ERROR: setError
}