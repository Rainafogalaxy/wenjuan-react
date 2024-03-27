// 专门存储组件列表的数据
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ComponentPropsType } from "../../components/QuestionComponents";
import { produce } from "immer";
import { getNextSelectedId } from "./utils";
import cloneDeep from "lodash.clonedeep"; //深拷贝
export type ComponentInfoType = {
  fe_id: string;
  type: string;
  title: string;
  isHidden?: boolean;
  isLocked?: boolean;
  props: ComponentPropsType;
};

export type ComponentsStateType = {
  selectedId: string;
  componentList: Array<ComponentInfoType>;

  // 复制粘贴
  copiedComponent: ComponentInfoType | null; //首先在类型上增加一个copiedComponent(它应该是一个组件类型)，null表示没有复制
};

const INIT_STATE: ComponentsStateType = {
  selectedId: "", //根据selectedid来判断哪个组件被选中
  componentList: [],
  copiedComponent: null, //默认初始化时没有复制
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
    // 添加新组件
    addComponent: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<ComponentInfoType>
      ) => {
        const newComponent = action.payload;
        // 如果当前没有选中任何组件，点击添加组件应该添加到最下边，否则插入到选择的组件的下边
        // 要获取当前选中的组件(selectedId)
        const { selectedId, componentList } = draft;
        const index = componentList.findIndex((c) => c.fe_id === selectedId);
        // 说明未选中任何组件
        if (index < 0) {
          draft.componentList.push(newComponent); //添加到最后一个
        } else {
          // 选中组件，插入到index后边
          draft.componentList.splice(index + 1, 0, newComponent);
        }
        draft.selectedId = newComponent.fe_id;
      }
    ),

    // 修改组件属性
    changeComponentProps: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ fe_id: string; newProps: ComponentPropsType }>
      ) => {
        const { fe_id, newProps } = action.payload;
        const curComp = draft.componentList.find((c) => c.fe_id === fe_id); //找到当前要修改属性的组件
        if (curComp) {
          curComp.props = {
            ...curComp.props,
            ...newProps,
          };
        }
      }
    ),

    // 删除选中组件
    removeSelectedComponent: produce((draft: ComponentsStateType) => {
      const { componentList = [], selectedId: removedId } = draft;
      // 重新计算selectedId
      const newSelectedId = getNextSelectedId(removedId, componentList);
      draft.selectedId = newSelectedId;
      const index = componentList.findIndex((c) => c.fe_id === removedId);
      componentList.splice(index, 1);
    }),
    // 隐藏和显示组件
    changeComponentHidden: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ fe_id: string; isHidden: boolean }>
      ) => {
        const { componentList = [] } = draft;
        const { fe_id, isHidden } = action.payload;

        let newSelectedId = "";
        if (isHidden) {
          //隐藏
          newSelectedId = getNextSelectedId(fe_id, componentList); // 重新计算selectedId
        } else {
          // 显示
          newSelectedId = fe_id;
        }
        draft.selectedId = newSelectedId;

        //通过fe_id找到当前要操作的组件
        const curComp = componentList.find((c) => c.fe_id === fe_id);
        if (curComp) {
          curComp.isHidden = isHidden;
        }
      }
    ),
    // 锁定 / 解锁组件
    toggleComponentLocked: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ fe_id: string }>
      ) => {
        const { fe_id } = action.payload;
        const { componentList = [] } = draft;
        const curComp = componentList.find((c) => c.fe_id === fe_id);
        if (curComp) {
          curComp.isLocked = !curComp.isLocked;
        }
      }
    ),
    // 复制当前选中的组件
    copySelectedComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentList = [] } = draft;
      const selectedComponent = componentList.find(
        (c) => c.fe_id === selectedId
      );
      if (selectedComponent == null) return; //没选中任何组件
      draft.copiedComponent = cloneDeep(selectedComponent); //这里要深拷贝
    }),
  },
});
export const {
  resetComponents,
  changeSelectedId,
  addComponent,
  changeComponentProps,
  removeSelectedComponent,
  changeComponentHidden,
  toggleComponentLocked,
  copySelectedComponent,
} = componentsSlice.actions;
export default componentsSlice.reducer;
