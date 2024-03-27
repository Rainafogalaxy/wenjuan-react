import React, { FC } from "react";
import { Button, Space, Tooltip } from "antd";
import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  CopyOutlined,
  BlockOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
} from "../../../store/componentsReducer";
import {} from "../../../store/componentsReducer";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";

const EditToolbar: FC = () => {
  const dispatch = useDispatch();
  //获取当前的选中组件的fe_id
  const { selectedId, selectedComponent } = useGetComponentInfo();
  const { isLocked } = selectedComponent || {};
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
          // onClick={}
        ></Button>
      </Tooltip>
    </Space>
  );
};
export default EditToolbar;
