import React, { FC } from "react";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { getComponentConfigByType } from "../../../components/QuestionComponents";

const NoProp: FC = () => {
  return <div style={{ textAlign: "center" }}>未选中组件</div>;
};
const ComponentProp: FC = () => {
  const { selectedComponent } = useGetComponentInfo();
  if (selectedComponent == null) return <NoProp />;

  const { type, props } = selectedComponent; //根据组件类型可以找到组件的配置
  const componentConfig = getComponentConfigByType(type);
  if (componentConfig == null) return <NoProp />;
  const { PropComponent } = componentConfig;
  return <PropComponent {...props} />;
};

export default ComponentProp;
