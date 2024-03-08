import React, { FC, useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import { useSearchParams } from "react-router-dom";
import ListSearch from "../../components/ListSearch";
import { Typography, Spin } from "antd";
import { useTitle, useRequest } from "ahooks";
import style from "./common.module.scss";
import { getQuestionListService } from "../../services/question";

const List: FC = () => {
  const { Title } = Typography;
  // 获取路由url参数
  // const [searchParams] = useSearchParams();
  // console.log(searchParams.get('keyword'));
  const { data = {}, loading } = useRequest(getQuestionListService);
  const { list = [], total } = data;
  return (
    <>
      {/* 1 */}
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={style.right}>
          <ListSearch />
        </div>
      </div>
      {/* 2 */}

      <div className={style.content}>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {!loading &&
          list.length > 0 &&
          list.map((item: any) => {
            const { _id } = item;
            return <QuestionCard key={_id} {...item} />;
          })}
      </div>
      {/* 3 */}
      <div className={style.footer}>leadMore...上划加载更多</div>
    </>
  );
};

export default List;
