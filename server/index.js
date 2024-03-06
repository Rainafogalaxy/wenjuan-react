const Koa = require("koa");
const Router = require("koa-router");
const mockList = require("./mock/index");

const koa = new Koa();
const router = new Router();
async function getRes(fn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = fn();
      resolve(res);
    }, 1000); //1s
  });
}
mockList.forEach((item) => {
  const { url, method, response } = item;
  router[method](url, async (ctx) => {
    //const res = response(); //执行response()函数。mock返回模拟数据
    const res = await getRes(response); //模拟网络请求的加载状态
    ctx.body = res;
  });
});

koa.use(router.routes());
koa.listen(3001);
