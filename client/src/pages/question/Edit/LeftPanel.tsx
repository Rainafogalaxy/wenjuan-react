import React, { FC } from "react";
import { Tabs } from "antd";
import ComponentLib from "./ComponentLib";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

const LeftPanel: FC = () => {
  const tabsItem = [
    {
      key: "componentLib",
      label: (
        <span>
          <AppstoreOutlined /> 组件库
        </span>
      ),
      children: <ComponentLib />,
    },
    {
      key: "layers",
      label: (
        <span>
          <BarsOutlined /> 图层
        </span>
      ),
    },
  ];
  return <Tabs defaultActiveKey="componentLib" items={tabsItem} />;
};

export default LeftPanel;
