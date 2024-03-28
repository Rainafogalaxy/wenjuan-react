import React, { ChangeEvent, FC, useState } from "react";
import style from "./Layers.module.scss";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { message, Input, Button, Space } from "antd";
import { EyeInvisibleOutlined, LockOutlined } from "@ant-design/icons";
import {
  changeComponentHidden,
  changeComponentTitle,
  changeSelectedId,
  toggleComponentLocked,
} from "../../../store/componentsReducer";

const Layers: FC = () => {
  const { componentList, selectedId } = useGetComponentInfo();
  const dispatch = useDispatch();

  //记录当前正在修改标题的组件
  const [changingTitleId, setChangingTitleId] = useState("");

  // 点击选中事件
  const handleTitleClick = (fe_id: string) => {
    const curComp = componentList.find((c) => c.fe_id === fe_id);
    if (curComp && curComp.isHidden) {
      message.info("不能选中隐藏的组件");
      return;
    }
    if (fe_id !== selectedId) {
      //如果当前组件未被选中，那么执行选中
      dispatch(changeSelectedId(fe_id));
      setChangingTitleId(""); //此时不要显示Input
      return;
    }
    // 点击修改标题
    setChangingTitleId(fe_id);
    // 即在图层中，如果要修改标题，需要点击两次(第一次首先要选中，然后再出现标题)
  };
  //修改标题
  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value.trim();
    if (!newTitle) return; //为空则直接返回
    if (!selectedId) return; //当前selectedId没选中
    dispatch(changeComponentTitle({ fe_id: selectedId, title: newTitle }));
  };
  //切换隐藏 / 显示
  const changeHidden = (fe_id: string, isHidden: boolean) => {
    dispatch(changeComponentHidden({ fe_id, isHidden }));
  };
  //切换锁定 / 解锁
  const changeLocked = (fe_id: string) => {
    dispatch(toggleComponentLocked({ fe_id }));
  };
  return (
    <>
      {componentList.map((c) => {
        const { fe_id, title, isHidden, isLocked } = c;
        // 拼接title，className
        const titleDefaultClassName = style.title;
        const selectedClassName = style.selected;
        const titleClassName = classNames({
          [titleDefaultClassName]: true,
          [selectedClassName]: fe_id === selectedId, //是否被选中
        });
        return (
          <div key={fe_id} className={style.wrapper}>
            <div
              className={titleClassName}
              onClick={() => handleTitleClick(fe_id)}
            >
              {/* 哪个组件正在修改标题，就不应该显示title，而是一个Input */}
              {fe_id === changingTitleId && (
                <Input
                  value={title}
                  onPressEnter={() => setChangingTitleId("")} //按下回车键，也去掉输入框
                  onBlur={() => setChangingTitleId("")} //失去焦点时
                  onChange={changeTitle} // 执行修改操作
                />
              )}
              {fe_id !== changingTitleId && title}
            </div>
            <div className={style.handler}>
              <Space>
                <Button
                  size="small"
                  shape="circle"
                  icon={<EyeInvisibleOutlined />}
                  type={isHidden ? "primary" : "text"}
                  className={!isHidden ? style.btn : ""}
                  onClick={() => changeHidden(fe_id, !isHidden)}
                />
                <Button
                  size="small"
                  shape="circle"
                  icon={<LockOutlined />}
                  type={isLocked ? "primary" : "text"}
                  className={!isLocked ? style.btn : ""}
                  onClick={() => changeLocked(fe_id)}
                />
              </Space>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Layers;
