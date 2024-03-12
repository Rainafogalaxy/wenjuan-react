import { useRequest } from "ahooks";
import { useSearchParams } from "react-router-dom";
import { getQuestionListService } from "../services/question";
import { LIST_SEARCH_PARA_KEY } from "../constant";

const useLoadQuestionListData = () => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("keyword"));
  const { data, loading, error } = useRequest(async () => {
    const keyword = searchParams.get(LIST_SEARCH_PARA_KEY) || "";
    const data = await getQuestionListService({ keyword });
    return data;
  });
  return { data, loading, error };
};

export default useLoadQuestionListData;
