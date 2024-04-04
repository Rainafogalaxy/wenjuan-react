// 这是一个饼图demo
// https://recharts.org/zh-CN/examples/TwoLevelPieChart
import React, { FC } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { STAT_COLORS } from "../../../../constant";
const data = [
  { name: "A1", value: 100 },
  { name: "A2", value: 300 },
  { name: "B1", value: 100 },
  { name: "B2", value: 80 },
  { name: "B3", value: 40 },
  { name: "B4", value: 30 },
];
const PieDemo: FC = () => {
  return (
    <div style={{ width: "300px", height: "400px" }}>
      {/* 这是一个容器组件 */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%" //x轴偏移
            cy="50%" //y轴偏移
            outerRadius={50} //饼图的直径
            fill="#8884d8" //饼图颜色
            label={(i) => `${i.name}:${i.value}`}
          >
            {/* i是当前的item */}
            {data.map((i, index) => {
              return <Cell key={index} fill={STAT_COLORS[index]} />;
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieDemo;
