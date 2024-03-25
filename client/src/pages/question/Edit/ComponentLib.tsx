import React, { FC } from "react";
import { Typography } from "antd";
import { nanoid } from "nanoid";
import style from "./ComponentsLib.module.scss";
import { addComponent } from "../../../store/componentsReducer";
import {
  ComponentConfigType,
  componentConfigGroup,
} from "../../../components/QuestionComponents";
import { useDispatch } from "react-redux";
const { Title } = Typography;

const Lib: FC = () => {
  const dispatch = useDispatch();
  // 生成组件的函数
  const genComponent = (c: ComponentConfigType) => {
    const { title, type, Component, defaultProps } = c;
    const handleClick = () => {
      // 点击后将组件添加到画布，并默认选中此组件
      dispatch(
        addComponent({
          fe_id: nanoid(), //生成一个不重复的ID
          title,
          type,
          props: defaultProps,
        })
      );
    };
    return (
      <div className={style.wrapper} onClick={handleClick} key={type}>
        <div className={style.component}>
          <Component />
        </div>
      </div>
    );
  };
  return (
    <>
      {componentConfigGroup.map((group, index) => {
        const { groupId, groupName, components } = group;
        return (
          <div key={groupId}>
            <Title
              level={3}
              style={{ fontSize: "16px", marginTop: index > 0 ? "20px" : "0" }}
            >
              {groupName}
            </Title>
            <div>{components.map((c) => genComponent(c))}</div>
          </div>
        );
      })}
    </>
  );
};

export default Lib;
