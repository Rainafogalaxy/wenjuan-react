import React, { FC } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { MANAGE_INDEX_PATHNAME } from "../router";
import style from "./Home.module.scss";
const { Title, Paragraph } = Typography;
const Home: FC = () => {
  const nav = useNavigate();
  return (
    <div className={style.container}>
      <div className={style.info}>
        <Title>
          <span className={style.wenjuan}>问卷调查 </span>|
          <span className={style.zaixian}> 在线投票</span>
        </Title>
        <Paragraph>
          已累计创建问卷 100 份,发布问卷 90 份,收到答卷 768 份
        </Paragraph>
        <div>
          <Button
            type="primary"
            onClick={() => {
              nav(MANAGE_INDEX_PATHNAME);
            }}
          >
            开始使用
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
