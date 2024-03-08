import React, { FC, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button, Space, Divider, message } from "antd";
import style from "./ManageLayout.module.scss";
import { useRequest } from "ahooks";
import { createQuestionService } from "../services/question";
import {
  BarsOutlined,
  DeleteOutlined,
  PlusOutlined,
  StarOutlined,
} from "@ant-design/icons";
const ManageLayout: FC = () => {
  const nav = useNavigate();
  const { pathname } = useLocation(); //可以判断当前是哪个页面
  // 如果设置了 options.manual = true，则 useRequest 不会默认执行，需要通过 run 或者 runAsync 来触发执行。
  const {
    loading,
    // error,
    run: handleCreateClick,
  } = useRequest(createQuestionService, {
    manual: true,
    onSuccess: (result) => {
      nav(`/question/edit/${result.id}`);
    },
  });
  return (
    <div className={style.container}>
      <div className={style.left}>
        <Space direction="vertical">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
            disabled={loading} //防止一直点击
          >
            新建问卷
          </Button>
          <Divider style={{ borderTop: "transparent" }} />
          <Button
            type={pathname.startsWith("/manage/list") ? "default" : "text"}
            size="large"
            icon={<BarsOutlined />}
            onClick={() => {
              nav("/manage/list");
            }}
          >
            我的问卷
          </Button>

          <Button
            type={pathname.startsWith("/manage/star") ? "default" : "text"}
            size="large"
            icon={<StarOutlined />}
            onClick={() => {
              nav("/manage/star");
            }}
          >
            星标问卷
          </Button>
          <Button
            type={pathname.startsWith("/manage/trash") ? "default" : "text"}
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
