// 输出所有的属性
import QuestionInputConfig, { QuestionInputPropsType } from "./QuestionInput";
import QuestionTitleConfig, { QuestionTitlePropsType } from "./QuestionTitle";
import type { FC } from "react";
export type ComponentPropsType = QuestionInputPropsType &
  QuestionTitlePropsType;

// 统一定义组件的配置
export type ComponentConfigType = {
  title: string;
  type: string;
  Component: FC<ComponentPropsType>;
  defaultProps: ComponentPropsType;
};
// 全部组件配置的列表(把所有组件类型写成一个数组(列表))
const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTitleConfig,
];
// 然后根据类型来获取组件配置的函数
export function getComponentConfigByType(type: string) {
  return componentConfigList.find((c) => c.type === type);
}