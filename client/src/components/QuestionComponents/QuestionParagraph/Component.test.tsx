import React from "react";
import Component from "./Component";

import { render, screen } from "@testing-library/react";

test("默认属性", () => {
  render(<Component />);
  const span = screen.getByText("一行段落");
  expect(span).toBeInTheDocument();
});

test("传入属性", () => {
  render(<Component text="hello" isCenter={true} />);
  const span = screen.getByText("hello");
  expect(span).toBeInTheDocument();
  //   通过span标签找到它的父元素
  const p = span.parentElement;
  expect(p).not.toBeNull(); //不为空

  //   断言里尽量不要加if
  const style = p!.style || {};
  expect(style.textAlign).toBe("center");
});

test("多行文字", () => {
  render(<Component text={"a\nb\nc"} />);
  const span = screen.getByText("a");
  expect(span).toBeInTheDocument();
  expect(span).toHaveTextContent("a"); //有文本内容
  expect(span).not.toHaveTextContent("ab"); //被换行
});
