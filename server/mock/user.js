const Mock = require("mockjs");
const Random = Mock.Random;
module.exports = [
  {
    // 获取用户信息
    url: "/api/user/info",
    method: "get",
    response() {
      return {
        errno: 0,
        data: {
          username: Random.title(),
          nickname: Random.cname(),
        },
      };
    },
  },
  {
    // 注册
    url: "/api/user/register",
    method: "post",
    response() {
      return {
        errno: 0,
      };
    },
  },
  {
    // 登录
    url: "/api/user/login",
    method: "post",
    response() {
      return {
        errno: 0,
        data: {
          token: Random.word(20), // 模拟登录，发起登录请求时，服务器会返回一个由Mockjs生成的随机token
        },
      };
    },
  },
];
