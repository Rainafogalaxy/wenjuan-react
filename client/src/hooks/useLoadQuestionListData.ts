import { useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import { getQuestionListService } from "../services/question";
import { LIST_SEARCH_PARA_KEY } from "../constant";

type OptionType = {
  isStar: boolean;
  isDeleted: boolean;
};

const useLoadQuestionListData = (opt: Partial<OptionType> = {}) => {
  const { isStar, isDeleted } = opt;
  const [searchParams] = useSearchParams();
  // console.log(searchParams.get("keyword"));
  const { data, loading, error } = useRequest(
    async () => {
      const keyword = searchParams.get(LIST_SEARCH_PARA_KEY) || "";
      const data = await getQuestionListService({ keyword, isStar, isDeleted });
      return data;
    },
    {
      refreshDeps: [searchParams], //刷新的依赖项，只要数组内的数据产生变化，上边函数就会重新执行
    }
  );
  return { data, loading, error };
};

export default useLoadQuestionListData;

// 搜索框与列表没有直接的联系，就是两个独立的组件，它们之间通过url的params参数建立联系
