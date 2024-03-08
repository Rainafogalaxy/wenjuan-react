// 生成问卷列表

const Mock = require("mockjs");
const Random = Mock.Random;

const getQuestionList = (len = 30, isDeleted = false) => {
  //默认不是假删除的
  const list = [];
  for (let i = 0; i < len; i++) {
    list.push({
      _id: Random.id(),
      title: Random.ctitle(),
      isPublished: Random.boolean(),
      isStar: Random.boolean(),
      answerCount: Random.natural(50, 100), //返回一个50-100的自然数
      createdAt: Random.datetime(),
      isDeleted, //假删除
    });
  }
  return list;
};

module.exports = getQuestionList;
