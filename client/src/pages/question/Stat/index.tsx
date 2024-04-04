import React, { FC, useState } from "react";
import { Spin, Result, Button } from "antd";
import style from "./index.module.scss";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData";
import useGetPageInfo from "../../../hooks/useGetPageInfo";
import ComponentList from "./ComponentList";
import StatHeader from "./StatHeader";
import { useNavigate } from "react-router-dom";
import { useTitle } from "ahooks";
const Stat: FC = () => {
  const { loading } = useLoadQuestionData();
  const { title, isPublished } = useGetPageInfo();
  const nav = useNavigate();

  //状态提升 selectedId type
  const [selectdComponentId, setSelectedComponentId] = useState("");
  // 组件的类型
  const [selectedComponentType, setSelectedComponentType] = useState("");

  // 修改标题
  useTitle(`问卷统计 - ${title}`);

  // loading效果
  const LoadingElem = (
    <div style={{ textAlign: "center", marginTop: "200px" }}>
      <Spin />
    </div>
  );

  // Content效果(主体)
  const genContentElem = () => {
    //如果没有发布(且不是undefined,因为没设置默认值，所以一开始是undefined，只有变为false时才显示)
    if (typeof isPublished === "boolean" && !isPublished) {
      return (
        <div style={{ flex: "1" }}>
          {/* 提示还未发布，不能在统计页提示统计信息 */}
          <Result
            status="warning"
            title="该页面尚未发布"
            extra={
              <Button type="primary" onClick={() => nav(-1)}>
                返回
              </Button>
            }
          />
        </div>
      );
    }
    return (
      <>
        <div className={style.left}>
          <ComponentList
            selectedComponentId={selectdComponentId}
            setSelectedComponentId={setSelectedComponentId}
            setSelectedComponentType={setSelectedComponentType}
          />
        </div>
        <div className={style.main}>mid</div>
        <div className={style.right}>right</div>
      </>
    );
  };

  return (
    <div className={style.container}>
      <StatHeader />
      <div className={style["content-wrapper"]}>
        {loading && LoadingElem}
        {!loading && <div className={style.content}>{genContentElem()}</div>}
      </div>
    </div>
  );
};

export default Stat;
