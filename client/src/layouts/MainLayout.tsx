import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { Layout, Spin } from "antd";
import style from "./MainLayout.module.scss";
import Logo from "../components/Logo";
import UserInfo from "../components/UserInfo";
import useLoadUserData from "../hooks/useLoadUserData";
const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  const { waitingUserData } = useLoadUserData();
  return (
    <Layout>
      <Header className={style.header}>
        <div className={style.left}>
          <Logo />
        </div>
        <div className={style.right}>
          <UserInfo />
        </div>
      </Header>
      <Layout className={style.main}>
        <Content>
          {waitingUserData ? (
            <div style={{ textAlign: "center", marginTop: "200px" }}>
              <Spin />
            </div>
          ) : (
            <Outlet />
          )}
          {/* <Outlet /> Outlet类似于Vue的slot */}
        </Content>
      </Layout>
      <Footer className={style.footer}>
        Star 问卷 &copy:2024 - present.Created by HoneyClock
      </Footer>
    </Layout>
  );
};

export default MainLayout;
