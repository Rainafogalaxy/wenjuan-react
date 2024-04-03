const Mock = require("mockjs");
const Random = Mock.Random;
const getQuestionList = require("./data/getQuestionList");
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
          componentList: [
            // Info
            {
              fe_id: Random.id(),
              type: "questionInfo",
              title: "问卷信息",
              isHidden: false, //隐藏组件
              isLocked: false, //锁定组件
              props: { text: "问卷标题", desc: "问卷描述..." },
            },
            // Title
            {
              fe_id: Random.id(),
              type: "questionTitle",
              title: "标题",
              isHidden: false, //隐藏组件
              isLocked: false, //锁定组件
              props: { text: "个人信息调研", level: 1, isCenter: false },
            }, // 组件类型不能重复，需要前后端统一
            // Input
            {
              fe_id: Random.id(),
              type: "questionInput",
              title: "输入框",
              isHidden: false,
              isLocked: false,
              props: { title: "你的姓名", placeholder: "请输入姓名..." },
            },
            // TextArea
            {
              fe_id: Random.id(),
              type: "questionTextarea",
              title: "多行输入框",
              isHidden: false,
              isLocked: false,
              props: { title: "你的爱好", placeholder: "请输入..." },
            },
            {
              fe_id: Random.id(),
              type: "questionInput",
              title: "输入框2",
              isHidden: false,
              isLocked: false,
              props: { title: "你的电话", placeholder: "请输入电话..." },
            },
            // Paragraph
            {
              fe_id: Random.id(),
              type: "questionParagraph",
              title: "段落",
              isHidden: false,
              isLocked: false,
              props: { title: "一行段落", isCenter: false },
            },
            // Radio
            {
              fe_id: Random.id(),
              type: "questionRadio",
              title: "单选",
              isHidden: false,
              isLocked: false,
              props: {
                title: "单选标题",
                isVertical: false,
                options: [
                  { value: "item1", text: "选项1" },
                  { value: "item2", text: "选项2" },
                  { value: "item3", text: "选项3" },
                ],
                value: "",
              },
            },
            // 多选
            {
              fe_id: Random.id(),
              type: "questionCheckbox",
              title: "多选",
              isHidden: false,
              isLocked: false,
              props: {
                title: "多选标题",
                isVertical: false,
                list: [
                  { value: "item1", text: "选项1", checked: false },
                  { value: "item2", text: "选项2", checked: false },
                  { value: "item3", text: "选项3", checked: false },
                ],
              },
            },
          ],
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
