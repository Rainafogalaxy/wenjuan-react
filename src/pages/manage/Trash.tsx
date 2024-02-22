import React, { FC, useState } from "react";
import { useTitle } from "ahooks";
import style from "./common.module.scss";
import { Typography, Empty, Table } from "antd";
const rawQuestionList = [
  {
    _id: "q1",
    title: "问卷1",
    isPublished: false,
    isStar: true,
    answerCount: 5,
    createdAt: "1.12 15:20",
  },
  {
    _id: "q2",
    title: "问卷2",
    isPublished: true,
    isStar: false,
    answerCount: 3,
    createdAt: "1.12 15:20",
  },
  {
    _id: "q3",
    title: "问卷3",
    isPublished: false,
    isStar: true,
    answerCount: 4,
    createdAt: "1.12 15:20",
  },
];
const { Title } = Typography;
const Trash: FC = () => {
  useTitle("Star - 回收站");
  const [questionList, setquestionList] = useState(rawQuestionList);
  const tableColumns = [
    {
      title:'标题',
      dataIndex:'title',
    },
    {
      title:'是否发布',
      dataIndex:'isPublished',
    },
    {
      title:'答卷',
      dataIndex:'answerCount'
    },
    {
      title:'ch',
      dataIndex:'answerCount'
    },
  ]
  return (
    <>
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={style.right}>搜索</div>
      </div>
      <div className={style.content}>
        {questionList.length === 0 && <Empty description="暂无数据"></Empty>}
      </div>
    </>
  );
};

export default Trash;
