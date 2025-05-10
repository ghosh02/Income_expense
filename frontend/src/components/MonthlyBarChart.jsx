// // components/MonthlyBarChart.jsx
// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const MonthlyBarChart = ({ data }) => {
//   return (
//     <div className="w-full h-[300px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           data={data}
//           margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="income" fill="#297AE6" name="Income" />
//           <Bar dataKey="expense" fill="#D5DEE9" name="Expense" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default MonthlyBarChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Formatter function for "k" style labels
const formatCurrency = (value) => {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
};

const MonthlyBarChart = ({ data }) => {
  return (
    <div className="w-full  h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={formatCurrency}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
          <Bar dataKey="income" fill="#297AE6" name="Income" />
          <Bar dataKey="expense" fill="#D5DEE9" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
