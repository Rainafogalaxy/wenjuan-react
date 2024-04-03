import { configureStore } from "@reduxjs/toolkit";
import userReducer, { UserStateType } from "./userReducer";
import componentsReducer, { ComponentsStateType } from "./componentsReducer";
import PageInfoReducer, { PageInfoType } from "./PageInfoReducer";
import undoable, { excludeAction, StateWithHistory } from "redux-undo";
export type StateType = {
  user: UserStateType;
  // components: ComponentsStateType;
  components: StateWithHistory<ComponentsStateType>; //增加undo后的类型
  pageInfo: PageInfoType;
};

export default configureStore({
  // 如果要使用redux-undo，要用undoable函数包装reducer(模块隔离)
  reducer: {
    // 分模块
    user: userReducer,
    // 组件列表
    // components: componentsReducer,

    /* 
    tip:
    undoable用于包装一个现有的reducer，使其具备撤销和重做的能力，它接受两个参数：
    1.被包装的reducer
    2.一个可选的配置对象
            ---->配置对象的选项:
                       1. limit  类型：number --> 限制历史记录的的大小，即可以撤销的最大步数，防止撤销历史占用太多内存
                       2. filter 类型:function --> 用于决定哪些动作会被添加到历史记录中
                       3. groupBy 类型:function --> 用于将连续的动作分组为一个可以一次性撤销的操作。
                       ...
    */

    /* 
     excludeAction是一个辅助函数，用于创建一个过滤器函数，这个函数可以传递给undoable的filter选项
     StateWithHistory是redux-undo中定义的一个TS类型，用于描述被undoable包装后的新类型
    */

    //组件列表(增加undo)
    components: undoable(componentsReducer, {
      limit: 20, //限制最多撤销 20 步
      filter: excludeAction([
        "components/resetComponents",
        "components/changeSelected",
        "components/selectPrevComponent",
        "components/selectNextComponent",
      ]),
    }),

    // 问卷信息
    pageInfo: PageInfoReducer,
  },
});
