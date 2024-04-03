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
  //   arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type PropsType = {
  children: JSX.Element | JSX.Element[]; //传进来的子组件可以是单个JSX元素或一个JSX元素数组
  items: Array<{ id: string; [key: string]: any }>; //一定要有一个id，其他的随意(可以扩展任何key是string的属性)
  onDragEnd: (oldIndex: number, newIndex: number) => void; //一个函数，当拖拽结束时被调用，参数是拖拽前后的索引位置
};

const SortableContainer: FC<PropsType> = (props: PropsType) => {
  const { children, items, onDragEnd } = props;
  // useSensor(KeyboardSensor, {  //键盘行为
  //   coordinateGetter: sortableKeyboardCoordinates,
  // })
  const sensors = useSensors(
    useSensor(MouseSensor, {
      //useSensor用于创建一个拖拽实例。
      // useSensors用于将多个实例组合起来
      activationConstraint: {
        distance: 8, //鼠标点击后移动超过8个像素才会触发拖拽移动，防止普通的点击也会触发拖拽
      },
    })
  );
  //拖拽结束时此函数被触发
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over == null) return; //检查拖拽的目标元素over是否为null，如果是null不进行任何操作
    if (active.id !== over.id) {
      //如果拖拽起始元素active和防止目标元素over的id不同，则查找这两个元素在items数组中的索引(oldIndex和newIndex)
      const oldIndex = items.findIndex((c) => c.fe_id === active.id);
      const newIndex = items.findIndex((c) => c.fe_id === over.id);
      onDragEnd(oldIndex, newIndex);
    }
  };
  //tip：这个children传进来的应该是一个列表，因为设定这里有两个地方需要拖拽，一个是左侧图层，另一个是画布组件
  // react 的children类似于vue的slot  比如说用到这个组件，然后给这个组件传一个子组件，这个子组件就会在这个地方
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {/* verticalListSortingStrategy：元素将在垂直方向上进行排列 */}
      {/* SortableContext用于定义一个可排序的上下文环境，它需要两个prop，item(一个数组，包含所有可排序元素的唯一标识符)和strategy(定义排序的策略，即如何根据拖拽操作更新元素的位置) */}
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};
// DndContext是一个React组件，用于提供拖拽功能的上下文环境，它将拖拽功能和状态封装在一个上下文中，使得子组件能够访问到拖拽相关的信息和操作

export default SortableContainer;
