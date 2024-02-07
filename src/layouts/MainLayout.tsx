import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";
import style from './MainLayout.module.scss';
const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  return (
    <Layout>
      <Header ></Header>
      <Content>
        <Outlet /> {/* Outlet类似于Vue的slot */}
      </Content>
      <Footer>MainLayout Footer</Footer>
    </Layout>
  );
};

export default MainLayout;
