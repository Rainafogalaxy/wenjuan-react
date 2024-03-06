const Mock = require("mockjs");
const Random = Mock.Random;
module.exports = [
  {
    url: "/api/test",
    method: "get",
    response() {
      return {
        errno: 0,
        data: {
          name: Random.cname(), //返回一个模拟的名字
        },
      };
    },
  },
];
