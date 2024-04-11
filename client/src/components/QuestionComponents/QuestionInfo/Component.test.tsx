import React from "react";
import Component from "./Component";

import { render, screen } from "@testing-library/react";

// 测试用例1
test("默认属性", () => {
  // 要先把组件渲染出来(渲染到Dom中)才能测试
  render(<Component />);
  const h = screen.getByText("问卷标题"); //根据文本获取一个元素
  expect(h).toBeInTheDocument(); //断言
});

// 测试用例2
test("传入属性", () => {
  render(<Component title="hello" desc="world" />);
  const h = screen.getByText("hello");
  expect(h).toBeInTheDocument();
  const p = screen.getByText("world");
  expect(p).toBeInTheDocument();
});
test("多行文字", () => {
  render(<Component desc={"a\nb\nc"} />);
  const span = screen.getByText("a");
  expect(span).toBeInTheDocument();
  expect(span).toHaveTextContent("a"); //有文本内容
  expect(span).not.toHaveTextContent("ab"); //被换行
});
