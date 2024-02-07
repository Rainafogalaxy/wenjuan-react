import React, { FC } from "react";
import { Outlet, useNavigate,useLocation } from "react-router-dom";
import { Button, Space, Divider } from "antd";
import style from "./ManageLayout.module.scss";
import {
  BarsOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
const ManageLayout: FC = () => {
  const nav = useNavigate();
  const {pathname} = useLocation(); //可以判断当前是哪个页面
  return (
    <div className={style.container}>
      <div className={style.left}>
        <Space direction="vertical">
          <Button type="primary" size="large" icon={<PlusOutlined />}>
            新建问卷
          </Button>
          <Divider style={{ borderTop: "transparent" }} />
          <Button
            type={pathname.startsWith('/manage/list')?'default':'text'}
            size="large"
            icon={<BarsOutlined />}
            onClick={() => {
              nav("/manage/list");
            }}
          >
            我的问卷
          </Button>

          <Button
            type={pathname.startsWith('/manage/star')?'default':'text'}
            size="large"
            icon={<StarOutlined />}
            onClick={() => {
              nav("/manage/star");
            }}
          >
            星标问卷
          </Button>
          <Button
            type={pathname.startsWith('/manage/trash')?'default':'text'}
            size="large"
            icon={<DeleteOutlined />}
            onClick={() => {
              nav("/manage/trash");
            }}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={style.right}>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
