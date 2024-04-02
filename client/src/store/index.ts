import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer";
import componentsReducer, { ComponentsStateType } from "./componentsReducer";
import PageInfoReducer, { PageInfoType } from "./PageInfoReducer";
export type StateType = {
  user: UserStateType;
  components: ComponentsStateType;
  pageInfo: PageInfoType;
};

export default configureStore({
  reducer: {
    // 分模块
    user: userReducer,
    // 组件列表
    components: componentsReducer,
    // 问卷信息
    pageInfo: PageInfoReducer,
  },
});
