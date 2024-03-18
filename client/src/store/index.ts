import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer";

export type StateType = {
  user: UserStateType;
};

export default configureStore({
  reducer: {
    // 分模块
    user: userReducer,
  },
});
