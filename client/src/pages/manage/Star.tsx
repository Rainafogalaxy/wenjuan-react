import React, { FC, useState } from "react";
import style from "./common.module.scss";
import { Typography ,Empty} from "antd";
import { useTitle } from "ahooks";
import QuestionCard from "../../components/QuestionCard";
import ListSearch from "../../components/ListSearch";

const { Title } = Typography;
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
    isStar: true,
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
const Star: FC = () => {
  useTitle("Star 问卷");
  const [questionList, setquestionList] = useState(rawQuestionList);

  return (
    <>
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>星标问卷</Title>
        </div>
        <div className={style.right}>
          <ListSearch/>
          </div>
      </div>
      <div className={style.content}>
        {questionList.length === 0 && <Empty description="暂无数据"/>}
        {questionList.length > 0 &&
          questionList.map((item) => {
            const { _id } = item;
            return <QuestionCard key={_id} {...item} />;
          })}
      </div>
      <div className={style.footer}>分页</div>
    </>
  );
};

export default Star;
