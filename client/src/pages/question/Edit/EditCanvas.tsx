import React, { FC, MouseEvent } from "react";
import { Spin } from "antd";
import style from "./EditCanvas.module.scss";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { getComponentConfigByType } from "../../../components/QuestionComponents/index";
import {
  ComponentInfoType,
  changeSelectedId,
  moveComponent,
} from "../../../store/componentsReducer";
import { useDispatch } from "react-redux";
import useBindCanvasKeyPress from "../../../hooks/useBindCanvasKeyPress";
import SortableContainer from "../../../components/DragSortable/SortableContainer";
import SortableItem from "../../../components/DragSortable/SortableItem";
import classNames from "classnames"; //classnames是一个库，用于方便地动态构建className字符串，可以根据组件的状态或属性来条件性地添加或合并类名，从而简化在JSX中处理css类名的逻辑
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
  const { componentList, selectedId } = useGetComponentInfo(); //componentList是从后端返回的一个组件列表
  const dispatch = useDispatch();
  const handleClick = (event: MouseEvent, id: string) => {
    event.stopPropagation(); //阻止冒泡(否则点击此按钮，会冒泡到外侧的main，样式会消失)
    dispatch(changeSelectedId(id));
  };
  // 绑定快捷键
  useBindCanvasKeyPress();
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        {/* 加载中 */}
        <Spin />
      </div>
    );
  }
  // SortableContainer组件的items属性需要每个item都有一个id
  const componentListWidthId = componentList.map((c) => {
    return { ...c, id: c.fe_id };
  });
  // 拖拽排序结束时的函数
  const handleDragEnd = (oldIndex: number, newIndex: number) => {
    dispatch(moveComponent({ oldIndex, newIndex }));
  };
  // 加载finished
  return (
    <SortableContainer items={componentListWidthId} onDragEnd={handleDragEnd}>
      <div className={style.canvas}>
        {componentList
          .filter((c) => !c.isHidden)
          .map((c) => {
            const { fe_id, isLocked } = c;
            // 拼接class name
            const wrapperDefaultClassName = style["component-wrapper"]; //默认的样式
            const selectedClassName = style.selected;
            // 拼接class(锁定组件的css效果)
            const lockedClassName = style.locked;
            const wrapperClassName = classNames({
              [wrapperDefaultClassName]: true,
              [selectedClassName]: fe_id === selectedId,
              [lockedClassName]: isLocked,
            });
            return (
              <SortableItem key={fe_id} id={fe_id}>
                <div
                  className={wrapperClassName}
                  onClick={(e) => {
                    handleClick(e, fe_id);
                  }}
                >
                  <div className={style.component}>{getComponent(c)}</div>
                </div>
              </SortableItem>
            );
          })}
      </div>
    </SortableContainer>
  );
};

export default EditCanvas;
