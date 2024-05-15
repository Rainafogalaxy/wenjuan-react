// 手动解析URL的查询字符串，将其转换为一个对象
const getQueryParams = (url) => {
  let queryParams = {};
  let urlObject = new URL(url); //利用URL类解析URL
  let params = new URLSearchParams(urlObject.search); //利用URLSearchParams处理查询参数
  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
};
const url =
  "https://www.google.com/search?q=%E8%B0%B7%E6%AD%8C%E9%83%B5%E7%AE%B1&oq=&gs_lcrp=EgZjaHJvbWUqCQgBEEUYOxjCAzIJCAAQRRg7GMIDMgkIARBFGDsYwgMyCQgCEEUYOxjCAzIJCAMQRRg7GMIDMgkIBBBFGDsYwgMyCQgFEEUYOxjCAzIJCAYQRRg7GMIDMgkIBxBFGDsYwgPSAQwyMjE1NjQ2ajBqMTWoAgiwAgE&sourceid=chrome&ie=UTF-8";
const params = getQueryParams(url);
console.log(params);

// 直接从当前页面的URL获取查询参数
const getQueryParams2 = () => {
  let queryParams = {};
  let params = new URLSearchParams(window.location.search); //获取当前URL的查询字符串部分
  params.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
};
