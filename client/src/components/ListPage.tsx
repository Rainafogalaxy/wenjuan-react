import React, { FC, useEffect, useState } from "react";
import { Pagination } from "antd";
import {
  LIST_PAGE_SIZE,
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE_PARAM_KEY,
} from "../constant";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
type PropsType = {
  total: number;
};

const ListPage: FC<PropsType> = (props: PropsType) => {
  const { total } = props;
  //   当前页
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(LIST_PAGE_SIZE);
  //   从url参数中找到page和pageSize，并且同步到Pagnation组件中
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1;
    setCurrent(page);
    const pageSize =
      parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") ||
      LIST_PAGE_SIZE;
    setPageSize(pageSize);
  }, [searchParams]);

  const nav = useNavigate(); //跳转
  const { pathname } = useLocation(); //获取当前路由
  //   当page，pageSize改变时，跳转页面(改变url参数)
  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    // 在这里改变url参数
    searchParams.set(LIST_PAGE_PARAM_KEY, page.toString());
    searchParams.set(LIST_PAGE_SIZE_PARAM_KEY, pageSize.toString());
    nav({
      pathname,
      search: searchParams.toString(), // 把当前的url参数换成string类型 => "a=1&b=2&c=3"这种
    });
  };
  return (
    //antd的分页详见： https://ant.design/components/pagination-cn
    <Pagination
      total={total}
      current={current} //当前页数
      pageSize={pageSize} //每页条数
      onChange={handlePageChange} //页码或pageSize改变的回调函数，参数是改变后得到页码，以及每页条数  function(page,pageSize)
      style={{
        background: "#fff",
        padding: "10px 0",
        borderRadius: "12px",
      }}
    />
  );
};

export default ListPage;
