import { ComponentInfoType } from ".";
export function getNextSelectedId(
  fe_id: string,
  componentList: Array<ComponentInfoType>
) {
  // 获取当前id的index
  const index = componentList.findIndex((c) => c.fe_id === fe_id); //fe_id是当前id
  if (index < 0) return ""; //说明没有选中，返回空字符串
  //   重新计算
  let newSelectedId = "";
  const length = componentList.length;
  if (length <= 1) {
    // 组件长度为1
    newSelectedId = "";
  } else {
    if (index + 1 === length) {
      // 说明要删除的是最后一个，就要选中上一个
      newSelectedId = componentList[index - 1].fe_id;
    } else {
      // 要删除的不是最后一个，删除以后，自动选择下一个
      newSelectedId = componentList[index + 1].fe_id;
    }
  }
  return newSelectedId;
}
