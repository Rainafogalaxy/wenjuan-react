import React from "react";
import Component from "./Component";

import { render, screen } from "@testing-library/react";

test("默认属性", () => {
  render(<Component />);
  const h = screen.getByText("一行标题");
  expect(h).toBeInTheDocument();
});
test("传入属性", () => {
  render(<Component text="hello" level={2} isCenter={true} />);
  const h = screen.getByText("hello");
  expect(h).toBeInTheDocument();
  expect(h.matches("h2")).toBeTruthy(); //返回的是true
  const style = h.style;
  expect(style.textAlign).toBe("center");
});
