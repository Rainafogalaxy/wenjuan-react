// 段落的组件
import React, { FC } from "react";
import { Typography } from "antd";
import {
  QuestionParagraphDefaultProps,
  QuestionParagraphPropsType,
} from "./interface";

const { Paragraph } = Typography;
// 在这里面写段落如何去渲染
const Component: FC<QuestionParagraphPropsType> = (
  props: QuestionParagraphPropsType
) => {
  const { text = "", isCenter = false } = {
    ...QuestionParagraphDefaultProps,
    ...props,
  }; //先解析默认的，后解析传入的，用来覆盖默认的
  const textList = text.split("\n"); //根据'\n'拆分，把文本替换成一个数组
  return (
    <Paragraph
      style={{ textAlign: isCenter ? "center" : "start", marginBottom: "0" }}
    >
      {textList.map((t, index) => {
        return (
          <span key={index}>
            {/* 如果当前不是第一个数组的元素 */}
            {index > 0 && <br />}
            {/* t是数组的每一项元素，就是根据换行符'\n'拆分出来的 */}
            {t}
          </span>
        );
      })}
    </Paragraph>
  );
};

export default Component;
