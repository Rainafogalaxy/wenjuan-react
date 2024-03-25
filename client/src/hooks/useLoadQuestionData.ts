// import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { ResDataType } from "../services/ajax";
import { getQuestionService } from "../services/question";
import { useDispatch } from "react-redux";
import { resetComponents } from "../store/componentsReducer";
import { useRequest } from "ahooks";
import { useEffect } from "react";
const useLoadQuestionData = () => {
  const { id = "" } = useParams(); //从哪个组件引用它，就会从哪个组件中获取到params中的id
  const dispatch = useDispatch();
  // ajax加载
  const { loading, data, error, run } = useRequest(
    async (id: string) => {
      if (!id) throw new Error("没有问卷id");
      const data = await getQuestionService(id);
      return data;
    },
    {
      manual: true,
    }
  );

  //   const [loading, setLoading] = useState(true); //每次载入页面，先显示加载中...
  //   const [questionData, setQuestionData] = useState<ResDataType>({});
  //   // useEffect()中的副作用函数是同步执行的，意味着他不能是一个被标记为async的异步函数(因为async函数会隐式返回一个Promise对象)，而不是一个清理函数或undefined
  //   useEffect(() => {
  //     const fn = async () => {
  //       const data = await getQuestionService(id);
  //       setQuestionData(data);
  //       setLoading(false);
  //     };
  //     fn();
  //   }, []);

  // 根据获取的data，设置redux store
  useEffect(() => {
    if (!data) return;
    const { title = "", componentList = [] } = data;
    // 获取默认的selectedId
    let selectedId = ""; //默认选中第一个
    if (componentList.length > 0) {
      selectedId = componentList[0].fe_id;
    }
    // 把componentList存到redux中
    dispatch(resetComponents({ componentList, selectedId }));
  }, [data]);

  // 判断 id 变化，执行ajax加载问卷数据
  useEffect(() => {
    run(id);
  }, [id]);
  //   useRequest()的第一个参数是一个异步函数，在组件初次加载时，会自动触发该函数的执行。
  // 同时自动管理该异步函数的loding，data，error等状态
  //   https://ahooks.js.org/zh-CN/hooks/use-request/basic

  return { loading, error };
};

export default useLoadQuestionData;
