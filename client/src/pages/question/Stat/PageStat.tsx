import { useRequest } from "ahooks";
import React, { FC, useState } from "react";
import { getQuestionStatListService } from "../../../services/stat";
import { useParams } from "react-router-dom";
type PropsType = {
  selectedComponentId: string;
  setSelectedComponentId: (id: string) => void;
  setSelectedComponentType: (type: string) => void;
};
const PageStat: FC<PropsType> = (props: PropsType) => {
  const { id = "" } = useParams();
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const { loading } = useRequest(
    async () => {
      const res = await getQuestionStatListService(id, {
        page: 1,
        pageSize: 10,
      });
      return res; //下边onSuccess的返回值就是这里的返回值
    },
    {
      onSuccess(res) {
        const { total, list = [] } = res;
        console.log(total);

        setTotal(total);
        setList(list);
      },
    }
  );
  return (
    <>
      {loading.toString()}
      {total}
    </>
  );
};

export default PageStat;
