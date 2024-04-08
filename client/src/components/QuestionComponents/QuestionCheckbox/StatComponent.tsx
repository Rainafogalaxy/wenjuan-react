import React, { FC } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QuestionCheckboxStatPropsType } from "./interface";

const StatComponent: FC<QuestionCheckboxStatPropsType> = ({ stat }) => {
  return (
    <div style={{ width: "350px", height: "240px" }}>
      <ResponsiveContainer>
        <BarChart
          width={350}
          height={240}
          data={stat}
          margin={{
            top: 5,
            right: 25,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" />{" "}
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#B9B9FF"
            activeBar={<Rectangle fill="#FFECF5" stroke="purple" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatComponent;
