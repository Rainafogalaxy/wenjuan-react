import React, { FC, useEffect, useState } from "react";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData";
import style from "./index.module.scss";
import EditCanvas from "./EditCanvas";
const Edit: FC = () => {
  // 此页面是问卷编辑页面
  const { loading } = useLoadQuestionData();
  return (
    <div className={style.container}>
      <div style={{ backgroundColor: "#fff", height: "40px" }}>Header</div>
      <div className={style["content-wrapper"]}>
        <div className={style.content}>
          <div className={style.left}>Left</div>
          <div className={style.main}>
            <div className={style["canvas-wrapper"]}>
              {/* <EditCanvas /> */}
              <EditCanvas/>
            </div>
          </div>
          <div className={style.right}>Right</div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
