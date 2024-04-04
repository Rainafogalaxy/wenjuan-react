import React, { FC } from "react";
import { Typography } from "antd";

// 临时引用
import PieDemo from "./rechartDemo/PieDemo";
import SimpleBarChart from "./rechartDemo/SimpleBarChart";

type PropsType = {
  selectedComponentId: string;
  selectedComponentType: string;
};
const { Title } = Typography;
const CharStat: FC<PropsType> = (props: PropsType) => {
  const { selectedComponentId, selectedComponentType } = props;
  return (
    <>
      <Title level={3}>图表统计</Title>
      {/* <PieDemo /> */}
      <SimpleBarChart />
    </>
  );
};

export default CharStat;
