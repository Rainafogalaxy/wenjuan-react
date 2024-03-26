import React, { FC } from "react";
import { Button, Typography, Space } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import style from "./EditHeader.module.scss";
import { useNavigate } from "react-router-dom";
const EditHeader: FC = () => {
  const nav = useNavigate();
  const { Title } = Typography;
  return (
    <div className={style["header-wrapper"]}>
      <div className={style.header}>
        <div className={style.left}>
          <Space>
            <Button
              type="link"
              icon={<LeftOutlined />}
              onClick={() => nav(-1)} // -1就是返回上一步
            >
              返回
            </Button>
            <Title style={{ paddingBottom: "0", marginTop: "0" }}>
              问卷标题
            </Title>
          </Space>
        </div>
        <div className={style.main}>中间</div>
        <div className={style.right}>
          <Space style={{ marginTop: "5px" }}>
            <Button>保存</Button>
            <Button type="primary">发布</Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
