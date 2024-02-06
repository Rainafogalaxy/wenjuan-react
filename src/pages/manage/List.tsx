import React, { FC, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import { useSearchParams } from "react-router-dom";
import {useTitle} from 'ahooks';
import style from "./List.module.scss";
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
  {
    _id: "q4",
    title: "问卷4",
    isPublished: true,
    isStar: false,
    answerCount: 5,
    createdAt: "1.12 15:20",
  },
  {
    _id: "q5",
    title: "问卷5",
    isPublished: false,
    isStar: true,
    answerCount: 2,
    createdAt: "1.12 15:20",
  },
];
const List: FC = () => {
  const [questionList, setquestionList] = useState(rawQuestionList);
  // 获取路由url参数
  // const [searchParams] = useSearchParams();
  // console.log(searchParams.get('keyword'));
  useTitle("Star 问卷 - 我的问卷")
  
  return (
    <>
      {/* 1 */}
      <div className={style.header}>
        <div className={style.left}>
          <h3>我的问卷</h3>
        </div>
        <div className={style.right}>搜索</div>
      </div>
      {/* 2 */}
      <div className={style.content}>
        {questionList.map((item) => {
          const { _id } = item;
          return <QuestionCard key={_id} {...item} />;
        })}
      </div>
      {/* 3 */}
      <div className={style.footer}>list page footer</div>
    </>
  );
};

export default List;
