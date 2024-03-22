import { useEffect } from "react";
import useGetUserInfo from "./useGetUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LOGIN_PATHNAME,
  MANAGE_INDEX_PATHNAME,
  isLoginOrRegister,
  isNoNeedUserInfo,
} from "../router";

const useNavPage = (waitingUserData: boolean) => {
  const { username } = useGetUserInfo();
  const { pathname } = useLocation();
  const nav = useNavigate();
  useEffect(() => {
    if (waitingUserData) return;
    // 如果已经登录了
    if (username) {
      // 为登录或注册页
      if (isLoginOrRegister(pathname)) {
        nav(MANAGE_INDEX_PATHNAME); //跳转到我的问卷
      }
      return;
    }
    // 未登录
    if (isNoNeedUserInfo(pathname)) {
      return;
    } else {
      nav(LOGIN_PATHNAME); //跳转到登录页
    }
  }, [username, pathname, waitingUserData]);
};

export default useNavPage;
