import React, { FC } from "react";
import { Button, Space, Tooltip } from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  CopyOutlined,
  BlockOutlined,
  UpOutlined,
  DownOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
  pasteCopiedComponent,
  moveComponent,
} from "../../../store/componentsReducer";
import {} from "../../../store/componentsReducer";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { ActionCreators as UndoActionCreators } from "redux-undo";

const EditToolbar: FC = () => {
  const dispatch = useDispatch();
  //获取当前的选中组件的fe_id
  const { selectedId, selectedComponent, copiedComponent, componentList } =
    useGetComponentInfo();
  const { isLocked } = selectedComponent || {};

  const length = componentList.length;
  const selectedIndex = componentList.findIndex((c) => c.fe_id === selectedId);
  const isFirst = selectedIndex <= 0; //当前选中的组件是第一个

  const isLast = selectedIndex + 1 >= length || selectedId == ""; //当前选中的组件是最后一个(或未选中时)

  // 删除组件
  const handleDelete = () => {
    dispatch(removeSelectedComponent());
  };
  // 隐藏组件
  const handleHidden = () => {
    dispatch(changeComponentHidden({ fe_id: selectedId, isHidden: true }));
  };
  // 锁定组件
  const handleLock = () => {
    dispatch(toggleComponentLocked({ fe_id: selectedId }));
  };
  // 复制组件
  const copy = () => {
    // 把当前选中的selectedId内的所有内容放到copiedComponent里面
    dispatch(copySelectedComponent());
  };
  // 粘贴组件
  const paste = () => {
    // 粘贴按钮要判断是否是disabled(就是已经拷贝过之后才能粘贴)
    if (copiedComponent) {
      dispatch(pasteCopiedComponent());
    }
  };
  // 上移
  const moveUp = () => {
    if (isFirst) return; //如果当前选中的已经是第一个，返回
    dispatch(
      moveComponent({ oldIndex: selectedIndex, newIndex: selectedIndex - 1 })
    );
  };
  // 下移
  const moveDown = () => {
    if (isLast) return; //如果当前选中的已经是最后一个，返回
    dispatch(
      moveComponent({ oldIndex: selectedIndex, newIndex: selectedIndex + 1 })
    );
  };
  // 撤销
  const undo = () => {
    dispatch(UndoActionCreators.undo());
  };
  // 重做
  const redo = () => {
    dispatch(UndoActionCreators.redo());
  };

  return (
    <Space>
      <Tooltip title="删除">
        <Button
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
        ></Button>
      </Tooltip>

      {/* 在此，给组件加一个是否隐藏的属性isHidden */}
      <Tooltip title="隐藏">
        <Button
          shape="circle"
          icon={<EyeInvisibleOutlined />}
          onClick={handleHidden}
        ></Button>
      </Tooltip>

      {/* 在此，给组件加一个是否锁定的属性isLocked */}
      <Tooltip title="锁定">
        <Button
          shape="circle"
          icon={<LockOutlined />}
          onClick={handleLock}
          type={isLocked ? "primary" : "default"}
        ></Button>
      </Tooltip>

      {/* 复制 */}
      <Tooltip title="复制">
        <Button shape="circle" icon={<CopyOutlined />} onClick={copy}></Button>
      </Tooltip>

      {/* 粘贴 */}
      <Tooltip title="粘贴">
        <Button
          shape="circle"
          icon={<BlockOutlined />}
          onClick={paste}
          disabled={copiedComponent == null}
        ></Button>
      </Tooltip>

      {/* 上移 */}
      <Tooltip title="上移">
        <Button
          shape="circle"
          icon={<UpOutlined />}
          onClick={moveUp}
          disabled={isFirst}
        ></Button>
      </Tooltip>

      {/* 下移 */}
      <Tooltip title="下移">
        <Button
          shape="circle"
          icon={<DownOutlined />}
          onClick={moveDown}
          disabled={isLast}
        ></Button>
      </Tooltip>

      {/* 撤销 */}
      <Tooltip title="撤销">
        <Button shape="circle" icon={<UndoOutlined />} onClick={undo}></Button>
      </Tooltip>

      {/* 重做 */}
      <Tooltip title="重做">
        <Button shape="circle" icon={<RedoOutlined />} onClick={redo}></Button>
      </Tooltip>
    </Space>
  );
};
export default EditToolbar;
