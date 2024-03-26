import React, { FC, useEffect, useState } from "react";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData";
import style from "./index.module.scss";
import EditCanvas from "./EditCanvas";
import { useDispatch } from "react-redux";
import { changeSelectedId } from "../../../store/componentsReducer";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
const Edit: FC = () => {
  // 此页面是问卷编辑页面
  const dispatch = useDispatch();
  const clearSelectedId = () => {
    dispatch(changeSelectedId(""));
  };
  const { loading } = useLoadQuestionData();
  return (
    <div className={style.container}>
      <div style={{ backgroundColor: "#fff", height: "40px" }}>Header</div>
      <div className={style["content-wrapper"]}>
        <div className={style.content}>
          <div className={style.left}>
            <LeftPanel />
          </div>
          {/* 背景空白处 */}
          <div className={style.main} onClick={clearSelectedId}>
            <div className={style["canvas-wrapper"]}>
              {/* <EditCanvas /> */}
              <EditCanvas loading={loading} />
            </div>
          </div>
          <div className={style.right}>
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
