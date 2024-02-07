import React, { FC } from "react";
import { Outlet } from "react-router-dom";
import {Button} from 'antd';
import style from "./ManageLayout.module.scss";
const ManageLayout: FC = () => {
  return (
    <div className={style.container}>
      <div className={style.left}>
        <p>ManageLayout Left</p>
        <Button type="primary" size="large">创建问卷</Button>
        <br />
        <a href="#">我的问卷</a>
        <br />
        <a href="#">星标问卷</a>
        <br />
        <a href="#">回收站</a>
      </div>
      <div className={style.right}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
