const setTimeStamp = config => {
  // 加上时间戳防止响应缓存数据
  config.params = {
    timestamp: new Date().getTime(),
    realIP: '116.25.146.177',
  };
  return config;
}

const setError = error => {
  console.log(error)
}

export default {
  SUCCESS: setTimeStamp,
  ERROR: setError
}