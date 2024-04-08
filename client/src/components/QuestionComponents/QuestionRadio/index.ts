import Component from "./Component";
import { QuestionRadioDefaultProps } from "./interface";
import PropComponent from "./PropComponent";
import StatComponent from "./StatComponent";

export * from "./interface";

// 组件配置
export default {
  title: "单选",
  type: "questionRadio",
  Component,
  PropComponent,
  defaultProps: QuestionRadioDefaultProps,
  StatComponent,
};
