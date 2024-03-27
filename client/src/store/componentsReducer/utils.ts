import { ComponentInfoType, ComponentsStateType } from ".";
export function getNextSelectedId(
  fe_id: string,
  componentList: Array<ComponentInfoType>
) {
  // 过滤一下隐藏的组件(后加的)
  const visibleComponentList = componentList.filter((c) => !c.isHidden);
  // 获取当前id的index
  const index = visibleComponentList.findIndex((c) => c.fe_id === fe_id); //fe_id是当前id
  if (index < 0) return ""; //说明没有选中，返回空字符串
  //   重新计算
  let newSelectedId = "";
  const length = visibleComponentList.length;
  if (length <= 1) {
    // 组件长度为1
    newSelectedId = "";
  } else {
    if (index + 1 === length) {
      // 说明要删除的是最后一个，就要选中上一个
      newSelectedId = visibleComponentList[index - 1].fe_id;
    } else {
      // 要删除的不是最后一个，删除以后，自动选择下一个
      newSelectedId = visibleComponentList[index + 1].fe_id;
    }
  }
  return newSelectedId;
}

// 抽离添加组件和复制组件到canvas的函数
export function insertNewComponent(
  draft: ComponentsStateType,
  newComponent: ComponentInfoType
) {
  // 如果当前没有选中任何组件，点击添加组件应该添加到最下边，否则插入到选择的组件的下边
  // 要获取当前选中的组件(selectedId)
  const { selectedId, componentList } = draft;
  const index = componentList.findIndex((c) => c.fe_id === selectedId);
  // 说明未选中任何组件
  if (index < 0) {
    draft.componentList.push(newComponent); //添加到最后一个
  } else {
    // 选中组件，插入到index后边
    draft.componentList.splice(index + 1, 0, newComponent);
  }
  draft.selectedId = newComponent.fe_id;
}
