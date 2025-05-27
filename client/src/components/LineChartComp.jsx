import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const LineChartComp = () => {
  const data = [
    { name: "Jan", income: 4500, expenses: 3200 },
    { name: "Feb", income: 5200, expenses: 2800 },
    { name: "Mar", income: 4800, expenses: 3100 },
    { name: "Apr", income: 5780, expenses: 4100 },
    { name: "May", income: 4900, expenses: 2950 },
    { name: "Jun", income: 5600, expenses: 3800 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5CE1E6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#5CE1E6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          strokeOpacity={0.2}
          stroke="#FFFFFF"
        />

        <XAxis
          dataKey="name"
          stroke="#FFFFFF"
          tick={{ fill: "#FFFFFF" }}
          axisLine={{ stroke: "#FFFFFF" }}
          className="funnel-display-sm"
        />

        <YAxis
          stroke="#FFFFFF"
          tick={{ fill: "#FFFFFF" }}
          axisLine={{ stroke: "#FFFFFF" }}
          className="funnel-display-sm"
        />

        <Tooltip
          content={
            <CustomTooltip active={true} payload={data} label="Expenses" />
          }
          cursor={{ stroke: "#FFFFFF", strokeOpacity: 0.1 }}
        />

        <Line
          type="monotone"
          dataKey="income"
          stroke="#5CE1E6"
          strokeWidth={2}
          dot={{ fill: "#5CE1E6", strokeWidth: 2 }}
          activeDot={{
            r: 6,
            fill: "#5CE1E6",
            stroke: "#FFA500",
            strokeWidth: 2,
          }}
          fillOpacity={1}
          fill="url(#incomeGradient)"
        />

        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#FFA500"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ fill: "#FFA500", strokeWidth: 2 }}
          activeDot={{
            r: 6,
            fill: "#FFA500",
            stroke: "#5CE1E6",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartComp;
