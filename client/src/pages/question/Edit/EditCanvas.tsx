import React, { FC } from "react";
import { Spin } from "antd";
import style from "./EditCanvas.module.scss";
// import QuestionTitle from "../../../components/QuestionComponents/QuestionTitle/Component";
// import QuestionInput from "../../../components/QuestionComponents/QuestionInput/Component";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { getComponentConfigByType } from "../../../components/QuestionComponents/index";
import { ComponentInfoType } from "../../../store/componentsReducer";
type PropsType = {
  loading: boolean;
};
// 在组件外边定义的好处是渲染时不会重复注册
const getComponent = (componentInfo: ComponentInfoType) => {
  const { type, props } = componentInfo; //每个组件的信息，(从服务端获取)
  const componentConfig = getComponentConfigByType(type);
  if (componentConfig == null) return null;
  const { Component } = componentConfig;
  return <Component {...props} />;
};
const EditCanvas: FC<PropsType> = ({ loading }) => {
  const { componentList } = useGetComponentInfo();
  // console.log(componentList);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        {/* 加载中 */}
        <Spin />
      </div>
    );
  }
  // 加载finished
  return (
    <div className={style.canvas}>
      {componentList.map((c) => {
        const { fe_id } = c;
        return (
          <div className={style["component-wrapper"]} key={fe_id}>
            <div className={style.component}>{getComponent(c)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default EditCanvas;
