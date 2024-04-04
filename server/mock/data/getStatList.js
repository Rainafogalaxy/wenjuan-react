// 答卷列表
// 答卷列表需要问卷列表的id

const { Random } = require("mockjs");
const getComponentList = require("./getComponentList");

module.exports = function getStatList(len = 10) {
  const componentList = getComponentList();
  const res = [];
  for (let i = 0; i < len; i++) {
    // 数组的每一项都是统计内容
    const stat = {
      _id: Random.id(),
    };
    componentList.forEach((c) => {
      const { fe_id, type, props } = c; //不同组件类型不一样，所以要获取类型
      switch (type) {
        case "questionInput":
          stat[fe_id] = Random.ctitle();
          break;
        case "questionTextarea":
          stat[fe_id] = Random.ctitle();
          break;
        case "questionRadio":
          stat[fe_id] = props.options[0].text;
          break;
        case "questionCheckbox":
          stat[fe_id] = `${props.list[0].text},${props.list[1].text}`;
          break;
      }
    });
    res.push(stat);
  }
  return res;
};
