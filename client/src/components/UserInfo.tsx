import React, { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LOGIN_PATHNAME } from "../router";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { getUserInfoService } from "../services/user";
import { useRequest } from "ahooks";
import { removeToken } from "../utils/user-token";
const UserInfo: FC = () => {
  const { data } = useRequest(getUserInfoService);
  const { username, nickname } = data || {};
  const nav = useNavigate();
  const logout = () => {
    nav(LOGIN_PATHNAME);
    removeToken();
  };
  // 已登录
  const UserInfo = (
    <>
      <span style={{ color: "#e8e8e8" }}>
        <UserOutlined />
        {nickname}
      </span>
      <Button type="link" onClick={logout}>
        退出
      </Button>
    </>
  );
  const Login = <Link to={LOGIN_PATHNAME}>登录</Link>;

  return <div>{username ? UserInfo : Login}</div>;
};

export default UserInfo;
