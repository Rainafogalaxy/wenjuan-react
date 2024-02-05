import React, { FC } from "react";
import style from "./QuestionCard.module.scss";
import { spawn } from "child_process";

type PropsType = {
  _id: string;
  title: string;
  isStar: boolean;
  isPublished: boolean;
  answerCount: number;
  createdAt: string;
};

const QuestionCard: FC<PropsType> = (props: PropsType) => {
  const { _id,title,createdAt ,answerCount,isPublished} = props;
  return (
    <div className={style.container}>
      <div className={style.title}>
        <div className={style.left}>
            <a href="#">{title}</a>
        </div>
        <div className={style.right}>
            {isPublished?<span style={{color:"green"}}>已发布</span>:<span style={{color:"red"}}>未发布</span>}
            &nbsp;
            <span>答卷:{answerCount}</span>
            &nbsp;
            <span>{createdAt}</span>
        </div>
      </div>
      <div className={style['button-container']}>
        <div className={style.left}>
            <button>编辑问卷</button>
            <button>数据统计</button>
        </div>
        <div className={style.right}>
            <button>标星</button>
            <button>复制</button>
            <button>删除</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
