import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { LIST_SEARCH_PARAM_KEY } from "../constant/index";
import { Input } from "antd";
const { Search } = Input;

const ListSearch: FC = () => {
  const [value, setValue] = useState<string>("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  // 获取url参数，并设置到input value (返回一个数组)
  const [searchParams] = useSearchParams();
  useEffect(() => {
    // 每当searchParams有变化，都会执行此回调函数
    const curVal = searchParams.get(LIST_SEARCH_PARAM_KEY) || "";
    setValue(curVal);
  }, [searchParams]);
  const nav = useNavigate();
  // 首先获取当前的路由
  const { pathname } = useLocation();
  const handleSearch = (value: string) => {
    //改变url(改变列表的值，如果刷新会消失)
    // 跳转页面，增加url参数
    nav({
      pathname,
      search: `${LIST_SEARCH_PARAM_KEY}=${value}`,
    });
  };
  return (
    <>
      <Search
        size="large"
        placeholder="Please enter your search content."
        enterButton
        allowClear
        value={value}
        onChange={handleChange}
        onSearch={handleSearch}
        style={{ width: "200px" }}
      />
    </>
  );
};

export default ListSearch;
