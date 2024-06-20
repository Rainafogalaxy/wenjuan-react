// 防抖：
const debounce = (fn, waitTime) => {
  let timeout;
  return () => {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, waitTime);
  };
};
// Use it
window.addEventListener(
  "resize",
  debounce(() => {
    console.log("我执行了");
  }, 300)
);

// 节流：(在指定的时间间隔内最多只执行一次)
const throttling = (fn, limit) => {
  let inThrottle; //标志变量，用于记录是否在冷却时间；
  return function () {
    //返回一个新函数，封装了原始的fn函数，控制它的执行频率
    const context = this,
      args = arguments;
    if (!inThrottle) {
      //为false
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

window.addEventListener(
  "scroll",
  throttling(() => {
    console.log("我执行了"), 300;
  })
);

// 防抖
// 防抖是让目标函数在事件触发的指定时间后执行，如果重复触发会取消上一次函数执行
const mydebounce = (func, wait) => {
  let timeout;
  return () => {
    const context = this;
    const arg = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(func, wait);
    }, wait);
  };
};
