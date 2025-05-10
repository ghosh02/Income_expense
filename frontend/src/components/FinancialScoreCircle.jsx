// import React from "react";
// import {
//   CircularProgressbarWithChildren,
//   buildStyles,
// } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// const getRating = (score) => {
//   if (score < 50) return { label: "Bad", color: "text-red-500" };
//   if (score < 75) return { label: "Good", color: "text-yellow-500" };
//   return { label: "Excellent", color: "text-green-500" };
// };
// const FinancialScoreCircle = ({ totalIncome, totalExpense, lastThree }) => {
//   const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)));

//   const currentRate =
//     totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;
//   const score1 = clamp(currentRate * 100 * 0.4);

//   const avgRate =
//     lastThree.reduce(
//       (acc, m) => acc + (m.income > 0 ? (m.income - m.expense) / m.income : 0),
//       0
//     ) / lastThree.length || 0;
//   const score2 = clamp(avgRate * 100 * 0.3);

//   const ratios = lastThree.map((m) =>
//     m.income > 0 ? m.expense / m.income : 1
//   );
//   const trendImprovement =
//     ratios.length >= 2 ? ratios[0] - ratios[ratios.length - 1] : 0;
//   const score3 = clamp((trendImprovement + 1) * 15);

//   const totalScore = clamp(score1 + score2 + score3);

//   return (
//     <div className="w-[250px] h-[250px] ">
//       <CircularProgressbarWithChildren
//         value={totalScore}
//         strokeWidth={10}
//         styles={buildStyles({
//           pathColor: "url(#gradient)",
//           trailColor: "#eee",
//           strokeLinecap: "round",
//         })}
//       >
//         <div className="text-center">
//           <div className="text-2xl font-semibold text-gray-700">
//             {totalScore}
//           </div>
//         </div>
//         <svg style={{ height: 0 }}>
//           <defs>
//             <linearGradient id="gradient">
//               <stop offset="0%" stopColor="#ff0055" />
//               <stop offset="100%" stopColor="#3366ff" />
//             </linearGradient>
//           </defs>
//         </svg>
//       </CircularProgressbarWithChildren>
//     </div>
//   );
// };

// export default FinancialScoreCircle;

import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const getRating = (score) => {
  if (score < 50) return { label: "Bad", color: "text-red-500" };
  if (score < 75) return { label: "Good", color: "text-yellow-500" };
  return { label: "Excellent", color: "text-green-500" };
};

const clamp = (val) => Math.max(0, Math.min(100, Math.round(val)));

const FinancialScoreCircle = ({
  totalIncome = 0,
  totalExpense = 0,
  lastThree = [],
}) => {
  // Ensure it's a valid array
  const validLastThree = Array.isArray(lastThree) ? lastThree : [];

  // Avoid divide by zero
  const currentRate =
    totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0;
  const score1 = clamp(currentRate * 100 * 0.4);

  const avgRate =
    validLastThree.length > 0
      ? validLastThree.reduce(
          (acc, m) =>
            acc + (m.income > 0 ? (m.income - m.expense) / m.income : 0),
          0
        ) / validLastThree.length
      : 0;
  const score2 = clamp(avgRate * 100 * 0.3);

  const ratios = validLastThree.map((m) =>
    m.income > 0 ? m.expense / m.income : 1
  );
  const trendImprovement =
    ratios.length >= 2 ? ratios[0] - ratios[ratios.length - 1] : 0;
  const score3 = clamp((trendImprovement + 1) * 15);

  const totalScore = clamp(score1 + score2 + score3);
  const { label, color } = getRating(totalScore);

  return (
    <div className="w-[280px] h-[280px] flex flex-col items-center">
      <CircularProgressbarWithChildren
        value={totalScore}
        strokeWidth={10}
        styles={buildStyles({
          pathColor: "url(#gradient)",
          trailColor: "#eee",
          strokeLinecap: "round",
        })}
      >
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">
            {totalScore}
          </div>
          {totalScore != 0 && (
            <p className={`mt-2 text-xl font-medium ${color}`}>{label}</p>
          )}
        </div>
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id="gradient">
              <stop offset="0%" stopColor="#ff0055" />
              <stop offset="100%" stopColor="#3366ff" />
            </linearGradient>
          </defs>
        </svg>
      </CircularProgressbarWithChildren>
    </div>
  );
};

export default FinancialScoreCircle;
