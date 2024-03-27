// 快捷键
import { useKeyPress } from "ahooks";
import { useDispatch } from "react-redux";
import {
  copySelectedComponent,
  pasteCopiedComponent,
  removeSelectedComponent,
  selecteNextComponent,
  selectePrevComponent,
} from "../store/componentsReducer";

const isActiveElementValid = () => {
  const activeElm = document.activeElement;
  if (activeElm === document.body) return true; //说明光标没有focus到input上边
  return false;
};

const useBindCanvasKeyPress = () => {
  const dispatch = useDispatch();
  //快捷键: 删除组件
  useKeyPress(["backspace", "delete"], () => {
    if (!isActiveElementValid()) return;
    dispatch(removeSelectedComponent()); //以下和正常点击按钮触发的效果都是一样的
  });
  //快捷键: 复制组件
  useKeyPress(["ctrl.c", "meta.c"], () => {
    if (!isActiveElementValid()) return;
    dispatch(copySelectedComponent());
  });
  //快捷键: 粘贴
  useKeyPress(["ctrl.v", "meta.v"], () => {
    if (!isActiveElementValid()) return;
    dispatch(pasteCopiedComponent());
  });
  //快捷键: 选中上一个
  useKeyPress("uparrow", () => {
    if (!isActiveElementValid) return;
    dispatch(selectePrevComponent());
  });

  //快捷键: 选中下一个
  useKeyPress("downarrow", () => {
    if (!isActiveElementValid) return;
    dispatch(selecteNextComponent());
  });
  //快捷键: 撤销  重做
};

export default useBindCanvasKeyPress;
