import React, { FC, useEffect, useState, useRef, useMemo } from "react";
import QuestionCard from "../../components/QuestionCard";
import { useSearchParams } from "react-router-dom";
import ListSearch from "../../components/ListSearch";
import { Typography, Spin, Empty } from "antd";
import { getQuestionListService } from "../../services/question";
import { useTitle, useRequest, useDebounceFn } from "ahooks";
import style from "./common.module.scss";
import {
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE,
  LIST_SEARCH_PARAM_KEY,
} from "../../constant";
const List: FC = () => {
  const { Title } = Typography;
  useTitle("我的问卷");
  const containerRef = useRef<HTMLDivElement>(null);
  const [list, setList] = useState([]); //list是累计加载的数据
  // const [loading,setLoading] = useState()
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const haveMoreData = total > list.length; // 是否有更多未加载数据

  const [started, setStarted] = useState(false); //优化: 标记是否开始加载(因为防抖有延迟时间)

  const [searchParams] = useSearchParams(); //url参数，有keyword
  const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || "";

  //(搜索)只要keyword改变 ,就重置当前页面信息(搜索后全部重新展示)
  useEffect(() => {
    setStarted(false);
    setPage(1);
    setList([]);
    setTotal(0);
  }, [keyword]);
  // 发起请求，实现加载的函数
  const { run: load, loading } = useRequest(
    async () => {
      const data = await getQuestionListService({
        page,
        pageSize: LIST_PAGE_SIZE,
        keyword,
      });
      return data;
    },
    {
      manual: true, //手动执行
      onSuccess(result) {
        const { list: l = [], total = 0 } = result;
        setList(list.concat(l));
        setTotal(total);
        setPage(page + 1);
      },
    }
  );

  // https://ahooks.js.org/zh-CN/hooks/use-debounce-fn
  const {
    run: tryLoadMore, // 触发加载的函数  (这里重命名一下)
    cancel, //取消当前防抖
    flush, //立即调用当前防抖函数
  } = useDebounceFn(
    //第一个参数 : 需要防抖执行的函数  ;  第二个参数 : 配置防抖的行为
    () => {
      // 应该判断，最底部的元素是否出现在可视区域内，如果在可视区域内，再触发加载
      const elem = containerRef.current;
      if (elem === null) return;
      const domRect = elem.getBoundingClientRect();
      if (domRect === null) return;
      const { bottom } = domRect;
      if (bottom <= document.body.clientHeight) {
        //
        load(); //加载数据
        setStarted(true); //加载时改为true(表示已经在加载了)
      }
    },
    { wait: 1000 } // 等待时间，单位为毫秒
  );
  // 页面初次加载，或url参数(keyword)有变化时，触发加载
  useEffect(() => {
    tryLoadMore(); //初始化
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
  }, [searchParams, haveMoreData]);

  // loadmore
  // useMemo()在每次重新渲染的时候能够缓存计算的结果。
  const LoadMoreContentElem = useMemo(() => {
    if (!started || loading) return <Spin />; //如果没有开始加载，或loading时，出现Spin(Spin就是转圈的加载中效果)
    if (total === 0) return <Empty description="暂无数据" />;
    if (!haveMoreData) return <span>没有更多数据了...</span>;
    return <span>加载更多...</span>;
  }, [started, loading, haveMoreData]);
  //第一个参数是要缓存计算值的函数，它应该是一个没有任何参数的纯函数，并且可以返回任意类型。
  // 第二个参数是所有在 calculateValue 函数中使用的响应式变量组成的数组。
  // https://zh-hans.react.dev/reference/react/useMemo
  // https://zh-hans.react.dev/reference/react/useMemo#usememo
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
        {list.length > 0 &&
          list.map((item: any) => {
            const { _id } = item;
            return <QuestionCard key={_id} {...item} />;
          })}
      </div>
      {/* 3 */}
      <div className={style.footer}>
        {/* useRef()用于监听DOM的变化 */}
        <div ref={containerRef}>{LoadMoreContentElem}</div>
        {/* 注意这里，如果这个函数不在useMemo之中，后边要加括号 */}
      </div>
    </>
  );
};

export default List;
