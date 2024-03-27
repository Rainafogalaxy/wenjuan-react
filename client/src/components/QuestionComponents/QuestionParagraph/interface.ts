// 属性的类型在这里写
export type QuestionParagraphPropsType = {
  text?: string; //段落内容
  isCenter?: boolean; //是否居中显示

  //用于属性表单
  onChange?: (newProps: QuestionParagraphPropsType) => void;
  disabled?: boolean;
};

// 输出一个默认属性
export const QuestionParagraphDefaultProps: QuestionParagraphPropsType = {
  text: "一行段落",
  isCenter: false,
};
