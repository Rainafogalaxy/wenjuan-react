import React, { FC } from "react";
import { Typography, Space, Checkbox } from "antd";
import {
  QuestionCheckboxPropsType,
  QuestionCheckboxDefaultProps,
} from "./interface";
const { Paragraph } = Typography;
const Component: FC<QuestionCheckboxPropsType> = (
  props: QuestionCheckboxPropsType
) => {
  const {
    title,
    isVertical,
    list = [],
  } = { ...QuestionCheckboxDefaultProps, ...props }; //从默认值和props中解构出需要的信息
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      {/* 是否竖向排列 */}
      <Space direction={isVertical ? "vertical" : "horizontal"}>
        {/* 循环checkbox */}
        {list.map((opt) => {
          const { value, text, checked } = opt;
          return (
            // value是不重复的
            <Checkbox value={value} key={value} checked={checked}>
              {text}
            </Checkbox>
          );
        })}
      </Space>
    </div>
  );
};

export default Component;
