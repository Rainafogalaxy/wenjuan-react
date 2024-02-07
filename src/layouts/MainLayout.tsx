import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import style from './MainLayout.module.scss';
const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  return (
    <Layout>
      <Header className={style.header}>
        <div className={style.left}>Logo</div>
        <div className={style.right}>登录</div>
      </Header>
      <Content className={style.main}>
        <Outlet /> {/* Outlet类似于Vue的slot */}
      </Content>
      <Footer className={style.footer}>
        Star 问卷 &copy:2024 - present.Created by HoneyClock
      </Footer>
    </Layout>
  );
};

export default MainLayout;
