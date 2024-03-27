import React, { FC } from "react";
import { Typography } from "antd";
import { QuestionInfoDefaultProps, QuestionInfoPropsType } from "./interface";
const { Title, Paragraph } = Typography;
const Component: FC<QuestionInfoPropsType> = (props: QuestionInfoPropsType) => {
  const { title, desc = "" } = { ...QuestionInfoDefaultProps, ...props };
  const descTextList = desc.split("\n");
  //渲染
  return (
    <div style={{ textAlign: "center" }}>
      <Title style={{ fontSize: "24px" }}>{title}</Title>
      <Paragraph>
        {descTextList.map((t, index) => {
          return (
            <span key={index}>
              {index > 0 && <br />}
              {t}
            </span>
          );
        })}
      </Paragraph>
    </div>
  );
};

export default Component;
