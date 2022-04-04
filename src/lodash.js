// 防抖: delay时间内的重复请求都会被刷新，在拥有足够的空闲时间delay后再发出请求
function debounce (func, delay, animation=()=>{}) {
  let forbid = null;
  return function () {
    if (forbid) {
      clearTimeout(forbid);
      // 展示防抖提示动画
      animation.apply(this); 
    }
    forbid = setTimeout(() => {
      func.apply(this, arguments);// 确保函数能接受到调用时传入的参数
    }, delay);
  }
}

// 节流: delay时间内若有多次请求，只会响应第一次
function throttle (func, delay) {
  let forbid = null;
  return function () {
    if (!forbid) {
      forbid = setTimeout(() => {
        func.apply(this);
        forbid = null;
      }, delay);
    }

  }
}

export {debounce, throttle}