// 专门存储组件列表的数据
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentPropsType } from "../../components/QuestionComponents";
import { produce } from "immer";
export type ComponentInfoType = {
  fe_id: string;
  type: string;
  title: string;
  props: ComponentPropsType;
};

export type ComponentsStateType = {
  selectedId: string;
  componentList: Array<ComponentInfoType>;
};

const INIT_STATE: ComponentsStateType = {
  selectedId: "", //根据selectedid来判断哪个组件被选中
  componentList: [],
};

export const componentsSlice = createSlice({
  name: "components",
  initialState: INIT_STATE,
  reducers: {
    // 重置所有组件
    resetComponents: (
      state: ComponentsStateType,
      action: PayloadAction<ComponentsStateType>
    ) => {
      return action.payload;
    },
    // 修改selectedId
    changeSelectedId: produce(
      //Immer是为了改进react不可变数据的写法(本质不变),不用再返回新的数据
      (draft: ComponentsStateType, action: PayloadAction<string>) => {
        draft.selectedId = action.payload; //payload是string类型，就是要修改的id
      }
    ),
  },
});
export const { resetComponents, changeSelectedId } = componentsSlice.actions;
export default componentsSlice.reducer;
