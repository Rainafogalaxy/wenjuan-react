const Mock = require("mockjs");
const Random = Mock.Random;
const getQuestionList = require("./data/getQuestionList");
const getComponentList = require("./data/getComponentList");
module.exports = [
  {
    url: "/api/question/:id",
    method: "get",
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
          title: Random.ctitle(),
          desc: "some descriptions",
          js: "",
          css: "",
          isPublished: true, //是否发布
          componentList: getComponentList()
        },
      };
    },
  },
  {
    // 创建问卷
    url: "/api/question",
    method: "post",
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
        },
      };
    },
  },
  {
    //获取(查询)问卷列表
    url: "/api/question",
    method: "get",
    response(ctx) {
      // console.log(ctx, ctx.url);
      const { url = "", query = {} } = ctx;
      const isDeleted = url.indexOf("isDeleted=true") >= 0;
      const isStar = url.indexOf("isStar=true") >= 0;
      const pageSize = parseInt(query.pageSize) || 10;
      return {
        errno: 0,
        data: {
          list: getQuestionList({ len: pageSize, isDeleted, isStar }), //当前页
          total: 100, //总数，分页
        },
      };
    },
  },
  {
    // 更新问卷
    url: "/api/question/:id",
    method: "patch",
    response() {
      return {
        errno: 0,
      };
    },
  },
  {
    // 复制问卷
    url: "/api/question/duplicate/:id",
    method: "post",
    response() {
      return {
        errno: 0,
        data: {
          id: Random.id(),
        },
      };
    },
  },
  {
    // 批量彻底删除问卷
    url: "/api/question",
    method: "delete",
    response() {
      return {
        errno: 0,
      };
    },
  },
];
