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
import { ActionCreators as UndoActionCreators } from "redux-undo";

const isActiveElementValid = () => {
  const activeElm = document.activeElement;
  // 没有增加dndkit之前(因为使用它会自动把每个组件包裹上一层div盒子)
  // if (activeElm === document.body) return true; //说明光标没有focus到input上边
  if (activeElm === document.body) return true;
  if (activeElm?.matches("div[role='button']")) return true;
  // let result = element.matches(selectorString);
  // 如果元素被指定的选择器字符串选择，Element.matches() 方法返回 true; 否则返回 false。
  // result 的值为 true 或 false.
  // selectorString 是个 css 选择器字符串。
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
  //快捷键: 撤销
  useKeyPress(
    ["ctrl.z", "meta.z"],
    () => {
      if (!isActiveElementValid) return;
      dispatch(UndoActionCreators.undo());
    },
    {
      exactMatch: true, //严格匹配(只按下ctrl + z才会触发，否则只要按下的键中带有以上的值就会触发)
    }
  );
  //快捷键: 重做
  useKeyPress(["ctrl.shift.z", "meta.shift.z"], () => {
    if (!isActiveElementValid) return;
    dispatch(UndoActionCreators.redo());
  });
};

export default useBindCanvasKeyPress;
