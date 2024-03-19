import { useEffect } from "react";
import useGetUserInfo from "./useGetUserInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { MANAGE_INDEX_PATHNAME, isLoginOrRegister } from "../router";
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
    
  }, [username, pathname]);
};

export default useNavPage;
