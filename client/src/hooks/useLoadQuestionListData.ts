import { useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import { getQuestionListService } from "../services/question";
import {
  LIST_SEARCH_PARAM_KEY,
  LIST_PAGE_PARAM_KEY,
  LIST_PAGE_SIZE_PARAM_KEY,
  LIST_PAGE_SIZE,
} from "../constant";

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
      const keyword = searchParams.get(LIST_SEARCH_PARAM_KEY) || "";
      // 分页
      const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1; //默认为第一页
      const pageSize =
        parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") ||
        LIST_PAGE_SIZE;
      const data = await getQuestionListService({
        keyword,
        isStar,
        isDeleted,
        page,
        pageSize,
      });
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
