// 问卷的输入框组件;
import Component from "./Component";

import { QuestionInputDefaultProps } from "./interface";
export * from "./interface";
// 组件的配置
export default {
  title: "输入框",
  type: "questionInput",
  Component,
  defaultProps: QuestionInputDefaultProps,
};
