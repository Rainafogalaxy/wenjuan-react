import React, { FC, useState } from "react";
import style from "./common.module.scss";
import { Typography, Empty, Spin } from "antd";
import { useTitle } from "ahooks";
import QuestionCard from "../../components/QuestionCard";
import ListSearch from "../../components/ListSearch";
import useLoadQuestionListData from "../../hooks/useLoadQuestionListData";

const { Title } = Typography;
const Star: FC = () => {
  useTitle("Star 问卷");
  const { data = {}, loading } = useLoadQuestionListData({ isStar: true });
  const { list = [], total = 0 } = data;
  return (
    <>
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>星标问卷</Title>
        </div>
        <div className={style.right}>
          <ListSearch />
        </div>
      </div>
      <div className={style.content}>
        {/* //loading */}
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin></Spin>
          </div>
        )}
        {!loading && list.length === 0 && <Empty description="暂无数据" />}
        {list.length > 0 &&
          list.map((item: any) => {
            const { _id } = item;
            return <QuestionCard key={_id} {...item} />;
          })}
      </div>
      <div className={style.footer}>分页</div>
    </>
  );
};

export default Star;
