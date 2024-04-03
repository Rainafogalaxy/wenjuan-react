import React, { Children, FC } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  PointerSensor,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type PropsType = {
  children: JSX.Element | JSX.Element[];
  items: Array<{ id: string; [key: string]: any }>; //一定要有一个id，其他的随意(可以扩展任何key是string的属性)
};

const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items } = props;
  // useSensor(KeyboardSensor, {  //键盘行为
  //   coordinateGetter: sortableKeyboardCoordinates,
  // })
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, //鼠标点击后移动超过8个像素才会触发拖拽移动，防止普通的点击也会触发拖拽
      },
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over == null) return;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((c) => c.fe_id === active.id);
      const newIndex = items.findIndex((c) => c.fe_id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    }
  };
  //tip：这个children传进来的应该是一个列表，因为设定这里有两个地方需要拖拽，一个是左侧图层，另一个是画布组件
  return <div>{children}</div>; // react 的children类似于vue的slot  比如说用到这个组件，然后给这个组件传一个子组件，这个子组件就会在这个地方
};

export default SortableContainer;
