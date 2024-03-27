// 获取redux中的数据
import { useSelector } from "react-redux";
import { StateType } from "../store";
import { ComponentsStateType } from "../store/componentsReducer";
const useGetComponentInfo = () => {
  const components = useSelector<StateType>(
    (state) => state.components
  ) as ComponentsStateType;
  const { componentList = [], selectedId, copiedComponent } = components;
  const selectedComponent = componentList.find((c) => c.fe_id === selectedId);
  return {
    componentList,
    selectedId,
    selectedComponent,
    copiedComponent, //当前已经拷贝的组件
  };
};
export default useGetComponentInfo;
