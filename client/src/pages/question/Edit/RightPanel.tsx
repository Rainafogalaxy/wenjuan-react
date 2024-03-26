import React, { FC } from "react";
import { Tabs } from "antd";
import { FileTextOutlined, SettingOutlined } from "@ant-design/icons";

import ComponentProp from "./ComponentProp";

const RightPanel: FC = () => {
  const tabsItem = [
    {
      key: "prop",
      label: (
        <span>
          <FileTextOutlined />
          属性
        </span>
      ),
      children: <ComponentProp />,
    },
    {
      key: "setting",
      label: (
        <span>
          <SettingOutlined />
          页面设置
        </span>
      ),
      children: <div>页面设置</div>,
    },
  ];
  return <Tabs items={tabsItem} defaultActiveKey="prop"></Tabs>;
};

export default RightPanel;
