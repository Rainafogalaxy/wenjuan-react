import Component from "./Component";
import PropComponent from "./PropComponent";
import { QuestionCheckboxDefaultProps } from "./interface";

export * from "./interface";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: "多选",
  type: "questionCheckbox",
  Component,
  PropComponent,
  defaultProps: QuestionCheckboxDefaultProps,
};
