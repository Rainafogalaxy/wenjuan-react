// 获取redux store中的信息
import { UseSelector, useSelector } from "react-redux";
import type { StateType } from "../store";
import type { PageInfoType } from "../store/PageInfoReducer";
const useGetPageInfo = () => {
  const pageInfo = useSelector<StateType>(
    (state) => state.pageInfo
  ) as PageInfoType;
  return pageInfo;
};

export default useGetPageInfo;
