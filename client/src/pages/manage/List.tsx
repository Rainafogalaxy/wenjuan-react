import React, { FC, useEffect, useState } from "react";
import QuestionCard from "../../components/QuestionCard";
import { useSearchParams } from "react-router-dom";
import ListSearch from "../../components/ListSearch";
import { Typography, Spin } from "antd";
import { useTitle, useRequest, useDebounceFn } from "ahooks";
import style from "./common.module.scss";
const List: FC = () => {
  const { Title } = Typography;
  useTitle("我的问卷");
  const [list, setList] = useState([]); //list是累计加载的数据
  // const [loading,setLoading] = useState()
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const haveMoreData = total > list.length; // 是否有更多未加载数据

  const [searchParams] = useSearchParams(); //url参数，有keyword
  // https://ahooks.js.org/zh-CN/hooks/use-debounce-fn
  const {
    run: tryLoadMore, // 触发加载的函数  (这里重命名一下)
    cancel, //取消当前防抖
    flush, //立即调用当前防抖函数
  } = useDebounceFn(
    //第一个参数 : 需要防抖执行的函数  ;  第二个参数 : 配置防抖的行为
    () => {
      console.log("i am going to load");
    },
    { wait: 1000 } // 等待时间，单位为毫秒
  );
  // 页面初次加载，或url参数(keyword)有变化时，触发加载
  useEffect(() => {
    tryLoadMore();
  }, [searchParams]);

  // 监听滑动时加载
  useEffect(() => {
    if (haveMoreData) {
      window.addEventListener("scroll", tryLoadMore); //防抖
    }
    // 组件销毁时
    return () => {
      window.removeEventListener("scroll", tryLoadMore); //解绑事件
    };
  }, [searchParams]);
  return (
    <>
      {/* 1 */}
      <div className={style.header}>
        <div className={style.left}>
          <Title level={3}>我的问卷</Title>
        </div>
        <div className={style.right}>
          <ListSearch />
        </div>
      </div>
      {/* 2 */}

      <div className={style.content}>
        {loading && (
          <div style={{ textAlign: "center" }}>
            <Spin />
          </div>
        )}
        {!loading &&
          list.length > 0 &&
          list.map((item: any) => {
            const { _id } = item;
            return <QuestionCard key={_id} {...item} />;
          })}
      </div>
      {/* 3 */}
      <div className={style.footer}>leadMore...上划加载更多</div>
    </>
  );
};

export default List;
