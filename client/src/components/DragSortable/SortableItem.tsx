import React, { FC } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
type PropsType = {
  id: string;
  children: JSX.Element;
};
const SortableItem: FC<PropsType> = ({ id, children }) => {
  //useSortable用于为单个可拖拽元素提供排序相关的逻辑和状态。
  //它返回一组属性和方法，使得元素能够响应拖拽操作并进行排序
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id }); //id用于跟踪和管理
  /* 
    tip：
       1.attributes：是一个对象，包含了必须应用于可拖拽元素的DOM属性
       2.listeners：一个对象，包含了必须应用于可拖拽元素的事件监听器，例如鼠标或触摸事件来启动拖拽操作
       3.setNodeRef：一个函数，用于将Dom节点与拖拽功能关联起来，需要将它传递给组件或元素的ref属性
       4.transform：包含了拖拽元素应用的CSS变换信息(例如位置偏移)，当拖拽一个元素时，transform会更新来反映元素的移动
       5.transition：一个css过渡字符串，用于在排序操作完成之后平滑地移动元素回到它的终点位置
     */
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default SortableItem;
