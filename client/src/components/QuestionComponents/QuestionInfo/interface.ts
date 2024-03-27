export type QuestionInfoPropsType = {
  title?: string; //标题
  desc?: string; //描述

  //用于propComponent
  onChange?: (newProps: QuestionInfoPropsType) => void;
  disabled?: boolean;
};

export const QuestionInfoDefaultProps: QuestionInfoPropsType = {
  title: "问卷标题",
  desc: "问卷描述",
};
