// 这是一个柱状图demo
// https://recharts.org/zh-CN/examples/SimpleBarChart
import React, { FC } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
//   Legend,
  ResponsiveContainer,
} from "recharts";

const SimpleBarChart: FC = () => {
  const data = [
    {
      name: "Page A", //name属性用作x轴的标签
      uv: 4000, //uv属性代表对应标签的数值
    },
    {
      name: "Page B",
      uv: 3000,
    },
    {
      name: "Page C",
      uv: 2000,
    },
    {
      name: "Page D",
      uv: 2780,
    },
    {
      name: "Page E",
      uv: 1890,
    },
    {
      name: "Page F",
      uv: 2390,
    },
    {
      name: "Page G",
      uv: 3490,
    },
  ];
  return (
    <div style={{ width: "350px", height: "240px" }}>
      {/* 使用ResponsiveContainer组件将BarChart包裹起来，确保图表讷讷够响应式地适应容器的大小 */}
      <ResponsiveContainer>
        <BarChart // 柱状图的外层容器
          width={350} // 这里的width和height实际上是被ResponsiveContainer管理的
          height={240}
          data={data}
          margin={{
            top: 5,
            right: 25,
            left: 0,
            bottom: 5,
          }}
        >
          {/* 为图表提供笛卡尔坐标网格 */}
          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="name" />{" "}
          {/* x轴 */}
          <YAxis /> {/* y轴 ，会自动根据数据进行填写*/}
          <Tooltip /> {/* 鼠标悬停在条形上时显示的提示信息框 */}
          {/* <Legend /> */} {/* 图例，展示图表的图例信息 */}
          <Bar //用于展示柱状图中的条形(如果有两个条形，这里就搞两个Bar)
            dataKey="uv"
            fill="#B9B9FF"
            activeBar={<Rectangle fill="#FFECF5" stroke="purple" />} //Rectangle用于自定义活动条(被选中或者鼠标悬停状态下的条形)的样式
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleBarChart;
