import { useEffect, useState } from "react";
import useGetUserInfo from "./useGetUserInfo";
import { useRequest } from "ahooks";
import { getUserInfoService } from "../services/user";
import { useDispatch } from "react-redux";
import { loginReducer } from "../store/userReducer";
const useLoadUserData = () => {
  const dispatch = useDispatch();
  const [waitingUserData, setWaitingUserData] = useState(true);
  //   加载完用户信息后，把它放到redux中
  const { username } = useGetUserInfo();
  //   如果之前已经获取到用户信息且已经存到了redux中，就不用再发一遍请求了
  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickname } = result; //获取响应值
      //   存储到redux store中:
      dispatch(loginReducer({ username, nickname })); //dispatch需要一个action作为参数
    },
    onFinally() {
      setWaitingUserData(false);
    },
  });
  useEffect(() => {
    if (username) {
      setWaitingUserData(false); //已经请求过
      return; //tip：因为没写这个return，所以一直在请求  OK
    }
    run(); //如果redux中没有，发起请求
  }, [username]);
  return { waitingUserData };
};

export default useLoadUserData;
