import React, { FC, useReducer } from "react";
import reducer from "./reducer";
import initialState from "./store";
const List: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <p>Hello</p>
    </>
  );
};

export default List;
