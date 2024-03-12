import React, { FC, useState } from "react";
import { useTitle } from "ahooks";
import style from "./common.module.scss";
import {
  Typography,
  Empty,
  Table,
  Tag,
  Button,
  Space,
  Modal,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import useLoadQuestionListData from "../../hooks/useLoadQuestionListData";
import ListSearch from "../../components/ListSearch";

const { Title } = Typography;
const { confirm } = Modal;
const Trash: FC = () => {
  const { data = {}, loading } = useLoadQuestionListData({ isDeleted: true });
  const { list = [], total = 0 } = data;
  useTitle("Star - 回收站");
  // 记录选中的id
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const tableColumns = [
    {
      title: "标题",
      dataIndex: "title",
    },
    {
      title: "是否发布",
      dataIndex: "isPublished",
      render: (isPublished: Boolean) => {
        return isPublished ? (
          <Tag color="processing">已发布</Tag>
        ) : (
          <Tag>未发布</Tag>
        );
      },
    },
    {
      title: "答卷",
      dataIndex: "answerCount",
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
    },
  ];
  const del = () => {
    confirm({
      title: "Are you sure to delete ?",
      icon: <ExclamationCircleOutlined />,
      content: "The act is irrevocable",
      onOk: () => {
        alert(`删除${JSON.stringify(selectedIds)}`);
      },
    });
  };
  const TableElem = (
    <>
      <div style={{ marginBottom: "16px" }}>
        <Space>
          <Button type="primary" disabled={selectedIds.length === 0}>
            恢复
          </Button>
          <Button danger disabled={selectedIds.length === 0} onClick={del}>
            彻底删除
          </Button>
        </Space>
      </div>
      <Table
        dataSource={list}
        columns={tableColumns}
        pagination={false}
        rowKey={(q) => q._id}
        rowSelection={{
          type: "checkbox",
          onChange: (selectedRowKeys) => {
            // console.log(selectedRowKeys);
            setSelectedIds(selectedRowKeys as string[]);
          },
        }}
      ></Table>
    </>
  );

  return (
    <>
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>回收站</Title>
        </div>
        <div className={style.right}>
          <ListSearch />
        </div>
      </div>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin></Spin>
        </div>
      )}
      <div className={style.content}>
        {!loading && list.length === 0 && (
          <Empty description="暂无数据"></Empty>
        )}
        {list.length > 0 && TableElem}
      </div>
    </>
  );
};

export default Trash;
