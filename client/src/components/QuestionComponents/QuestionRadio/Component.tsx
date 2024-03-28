import React, { FC } from "react";
import { QuestionRadioPropsType, QuestionRadioDefaultProps } from "./interface";
import { Typography, Radio, Space } from "antd";

const { Paragraph } = Typography;
const Component: FC<QuestionRadioPropsType> = (
  props: QuestionRadioPropsType
) => {
  const {
    title,
    options = [],
    value,
    isVertical,
  } = { ...QuestionRadioDefaultProps, ...props };
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Radio.Group value={value}>
        <Space direction={isVertical ? "vertical" : "horizontal"}>
          {options.map((opt) => {
            const { value, text } = opt;
            return (
              <Radio value={value} key={value}>
                {text}
              </Radio>
            );
          })}
        </Space>
      </Radio.Group>
    </div>
  );
};

export default Component;
