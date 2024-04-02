import React, { FC, useEffect, useState } from "react";
import { Tabs } from "antd";
import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";
import PageSetting from "./PageSetting";
import ComponentProp from "./ComponentProp";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";

// TS 枚举类型(一个属性有有限个key)
enum TAB_KEYS {
  PROP_KEY = "prop",
  SETTING_KEY = "setting",
}
// 使用枚举时，ts编译器会生成双向映射代码，可以通过枚举的名字访问到值，也可以通过值访问名字

const RightPanel: FC = () => {
  const [activeKey, setActiveKey] = useState(TAB_KEYS.PROP_KEY);
  const { selectedId } = useGetComponentInfo();
  useEffect(() => {
    if (selectedId)
      setActiveKey(TAB_KEYS.PROP_KEY); //选中了canvas中的组件，就到属性页面
    else setActiveKey(TAB_KEYS.SETTING_KEY); //没选中就到页面设置
  }, [selectedId]);
  const tabsItem = [
    {
      key: TAB_KEYS.PROP_KEY,
      label: (
        <span>
          <FileTextOutlined />
          属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: TAB_KEYS.SETTING_KEY,
      label: (
        <span>
          <SettingOutlined />
          页面设置
        </span>
      ),
      children: <PageSetting />,
    },
  ];
  return <Tabs items={tabsItem} activeKey={activeKey}></Tabs>;
};

export default RightPanel;
