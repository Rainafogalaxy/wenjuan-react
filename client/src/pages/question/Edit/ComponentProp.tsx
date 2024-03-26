import React, { FC } from "react";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import {
  ComponentPropsType,
  getComponentConfigByType,
} from "../../../components/QuestionComponents";
import { changeComponentProps } from "../../../store/componentsReducer";
import { useDispatch } from "react-redux";

const NoProp: FC = () => {
  return <div style={{ textAlign: "center" }}>未选中组件</div>;
};
const ComponentProp: FC = () => {
  const dispatch = useDispatch();
  const { selectedComponent } = useGetComponentInfo();
  if (selectedComponent == null) return <NoProp />;

  const { type, props } = selectedComponent; //根据组件类型可以找到组件的配置
  const componentConfig = getComponentConfigByType(type);
  if (componentConfig == null) return <NoProp />;
  const { PropComponent } = componentConfig;
  const changeProps = (newProps: ComponentPropsType) => {
    if (selectedComponent == null) return;
    const { fe_id } = selectedComponent;
    dispatch(changeComponentProps({ fe_id, newProps }));
  };
  return <PropComponent {...props} onChange={changeProps} />;
};

export default ComponentProp;
