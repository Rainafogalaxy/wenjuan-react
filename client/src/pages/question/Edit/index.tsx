import React, { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getQuestionService } from "../../../services/question";
const Edit: FC = () => {
  const { id = "" } = useParams();
  // useEffect()中的副作用函数是同步执行的，意味着他不能是一个被标记为async的异步函数(因为async函数会隐式返回一个Promise对象)，而不是一个清理函数或undefined
  useEffect(() => {
    const fn = async () => {
      const data = await getQuestionService(id);
      console.log(data);
    };
    fn();
  }, []);

  return <p>Edit {id}</p>;
};

export default Edit;
