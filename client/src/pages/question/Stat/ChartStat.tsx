import React, { FC, useEffect, useState } from "react";
import { Typography } from "antd";

// 临时引用
// import PieDemo from "./rechartDemo/PieDemo";
// import SimpleBarChart from "./rechartDemo/SimpleBarChart";
import { useRequest } from "ahooks";
import { getComponentStatService } from "../../../services/stat";
import { useParams } from "react-router-dom";
import { getComponentConfigByType } from "../../../components/QuestionComponents";

type PropsType = {
  selectedComponentId: string;
  selectedComponentType: string;
};
const { Title } = Typography;

const CharStat: FC<PropsType> = (props: PropsType) => {
  // 需要selectedComponentType来判断是否有统计组件(因为单选和多选有，其他没有)
  const { selectedComponentId, selectedComponentType } = props;
  const { id = "" } = useParams();

  const [stat, setStat] = useState([]);
  const { run } = useRequest(
    async (questionId, selectedComponentId) =>
      await getComponentStatService(questionId, selectedComponentId),
    {
      manual: true,
      onSuccess(res) {
        setStat(res.stat);
      },
    }
  );
  useEffect(() => {
    if (selectedComponentId) run(id, selectedComponentId);
  }, [selectedComponentId]);

  // 生成图表的jsx函数
  const genStatElem = () => {
    if (!selectedComponentId) return <div>未选中组件</div>;
    // 获取组件配置(根据类型获取配置)
    const { StatComponent } =
      getComponentConfigByType(selectedComponentType) || {};
    if (StatComponent == null) return <div>该组件无统计图表</div>;
    return <StatComponent stat={stat} />;
  };
  return (
    <>
      <Title level={3}>图表统计</Title>
      {/* <PieDemo /> */}
      {/* <SimpleBarChart /> */}
      {genStatElem()}
    </>
  );
};

export default CharStat;
