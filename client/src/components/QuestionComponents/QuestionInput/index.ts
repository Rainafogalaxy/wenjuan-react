// 问卷的输入框组件;
import Component from "./Component";
import PropComponent from "./PropComponent";
import { QuestionInputDefaultProps } from "./interface";
export * from "./interface";
// 组件的配置
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "输入框",
  type: "questionInput",
  Component, //画布显示的组件
  PropComponent, //修改属性的组件  (根据selected显示属性组件)
  defaultProps: QuestionInputDefaultProps, //默认的属性
};
