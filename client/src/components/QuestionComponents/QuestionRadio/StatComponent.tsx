import React, { FC, useMemo } from "react";
import { QuestionRadioStatPropsType } from "./interface";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { STAT_COLORS } from "../../../constant";

const format = (n: number) => {
  return (n * 100).toFixed(2);
};
const StatComponent: FC<QuestionRadioStatPropsType> = ({ stat = [] }) => {
  const sum = useMemo(() => {
    let s = 0;
    stat.forEach((i) => (s += i.count));
    return s;
  }, [stat]);
  return (
    <div style={{ width: "300px", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={stat}
            dataKey="count"
            cx="50%"
            cy="50%"
            outerRadius={50}
            fill="#8884d8"
            label={(i) => `${i.name}:${format(i.count / sum)}%`}
          >
            {stat.map((i, index) => {
              return <Cell key={index} fill={STAT_COLORS[index]} />;
            })}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatComponent;
