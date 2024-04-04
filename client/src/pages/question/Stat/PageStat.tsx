import { useRequest } from "ahooks";
import React, { FC, useState } from "react";
import { Typography, Spin, Table, Pagination } from "antd";
import { getQuestionStatListService } from "../../../services/stat";
import { useParams } from "react-router-dom";
import useGetComponentInfo from "../../../hooks/useGetComponentInfo";
import { STAT_PAGE_SIZE } from "../../../constant";

type PropsType = {
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  setSelectedComponentType: (type: string) => void;
};
const { Title } = Typography;
const PageStat: FC<PropsType> = (props: PropsType) => {
  const {
    selectedComponentId,
    setSelectedComponentId,
    setSelectedComponentType,
  } = props;
  const { id = "" } = useParams();
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(STAT_PAGE_SIZE);
  const { loading } = useRequest(
    async () => {
      const res = await getQuestionStatListService(id, {
        page,
        pageSize,
      });
      return res; //下边onSuccess的返回值就是这里的返回值
    },
    {
      refreshDeps: [id,page, pageSize], //依赖于page，pageSize进行刷新(重新请求)
      onSuccess(res) {
        const { total, list = [] } = res;
        setTotal(total);
        setList(list);
      },
    }
  );

  const { componentList } = useGetComponentInfo();
  //定义表格的列column
  const columns = componentList.map((c) => {
    const { fe_id, title, props = {}, type } = c;
    const colTitle = props!.title || title; //叹号表示不需要ts检查
    return {
      // title: colTitle,
      // title可以是一个JSX片段
      title: (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setSelectedComponentId(fe_id);
            setSelectedComponentType(type);
          }}
        >
          <span
            style={{
              color: fe_id === selectedComponentId ? "#1890ff" : "inherit",
            }}
          >
            {colTitle}
          </span>
        </div>
      ),
      dataIndex: fe_id,
    };
  });

  const dataSource = list.map((i: any) => ({ ...i, key: i._id })); //为每一项加上一个id
  // dataSource就是列表
  // pagination是表格的默认分页
  const TableElem = (
    <>
      {" "}
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      ></Table>
      {/* 分页 */}
      <div style={{ textAlign: "center", marginTop: "18px" }}>
        <Pagination
          total={total}
          pageSize={pageSize}
          current={page}
          onChange={(page) => setPage(page)}
          onShowSizeChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </div>
    </>
  );

  return (
    <div>
      <Title level={3}>答卷数量:{!loading && total}</Title>
      {loading && (
        <div style={{ textAlign: "center" }}>
          <Spin />
        </div>
      )}
      {!loading && TableElem}
    </div>
  );
};

export default PageStat;
