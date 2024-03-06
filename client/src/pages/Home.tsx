import React, { FC, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Typography } from "antd";
import { MANAGE_INDEX_PATHNAME } from "../router";
import style from "./Home.module.scss";

// test  mockjs
// import "../_mock/index"; //引用mock文件
// import axios from "axios";

const { Title, Paragraph } = Typography;
const Home: FC = () => {
  // tip:React18 useEffect() 在开发环境下会执行两次 (React 为了帮助发现副作用错误，会故意重复调用生命周期方法)
  // tip2:mockjs只能劫持XMLRequest，不能劫持fetch请求
  // axios内部使用的是XML API
  // useEffect(() => {
  //   axios.get("/api/test").then((res) => {
  //     console.log(res);
  //   });
  // }, []);
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
