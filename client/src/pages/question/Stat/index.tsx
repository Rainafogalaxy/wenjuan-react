import React, { FC } from "react";
import { Spin, Result, Button } from "antd";
import useLoadQuestionData from "../../../hooks/useLoadQuestionData";
import useGetPageInfo from "../../../hooks/useGetPageInfo";
import { useNavigate } from "react-router-dom";
import { useTitle } from "ahooks";
const Stat: FC = () => {
  const { loading } = useLoadQuestionData();
  const { title, isPublished } = useGetPageInfo();
  const nav = useNavigate();

  // 修改标题
  useTitle(`问卷统计 - ${title}`);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "200px" }}>
        <Spin />
      </div>
    );
  }
  //如果没有发布
  if (!isPublished) {
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
  return <div>DohKyungSoo</div>;
};

export default Stat;
