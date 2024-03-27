// 输出所有的属性
import QuestionInputConfig, { QuestionInputPropsType } from "./QuestionInput";
import QuestionTitleConfig, { QuestionTitlePropsType } from "./QuestionTitle";
import QuestionInfoConfig, { QuestionInfoPropsType } from "./QuestionInfo";
import QuestionParagraphConfig, {
  QuestionParagraphPropsType,
} from "./QuestionParagraph";

import type { FC } from "react";
// 统一，各个组件的prop type
export type ComponentPropsType = QuestionInputPropsType &
  QuestionTitlePropsType &
  QuestionParagraphPropsType &
  QuestionInfoPropsType;

// 统一定义组件的配置 type
export type ComponentConfigType = {
  title: string;
  type: string;
  Component: FC<ComponentPropsType>;
  PropComponent: FC<ComponentPropsType>;
  defaultProps: ComponentPropsType;
};
// 全部组件配置的列表(把所有组件类型写成一个数组(列表))
const componentConfigList: ComponentConfigType[] = [
  QuestionInputConfig,
  QuestionTitleConfig,
  QuestionParagraphConfig,
  QuestionInfoConfig,
];

// 组件分组
export const componentConfigGroup = [
  {
    groupId: "textGroup",
    groupName: "文本显示",
    components: [
      QuestionInfoConfig,
      QuestionTitleConfig,
      QuestionParagraphConfig,
    ],
  },
  {
    groupId: "inputGroup",
    groupName: "用户输入",
    components: [QuestionInputConfig],
  },
];

// 然后根据类型来获取组件配置的函数
export function getComponentConfigByType(type: string) {
  return componentConfigList.find((c) => c.type === type);
}
