import React, { FC, useReducer } from "react";

type StateType = { count: number };
type ActionType = { type: string };
const initialState: StateType = { count: 100 }; //初始值
// 根据传入的action，返回新的state(state是不可变数据)
//reducer：用于更新 state 的纯函数。
// 参数为 state 和 action，返回值是更新后的 state。state 与 action 可以是任意合法值。
const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
};

// initialArg：用于初始化 state 的任意值。初始值的计算逻辑取决于接下来的 init 参数。

// https://zh-hans.react.dev/reference/react/useReducer
const Reducer: FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <span>Count:{state.count}</span>
      <button
        onClick={() => {
          dispatch({ type: "increment" });
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          dispatch({ type: "decrement" });
        }}
      >
        -
      </button>
    </>
  );
};
export default Reducer;
