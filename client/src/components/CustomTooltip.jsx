import React from "react";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

const CustomTooltip = ({ active, payload, label }) => {
  // Safely check for required data
  if (!active || !payload || payload.length < 2) return null;

  // Find values by data key instead of array index
  const incomeEntry = payload.find((entry) => entry.dataKey === "income");
  const expensesEntry = payload.find((entry) => entry.dataKey === "expenses");

  // Format values with fallbacks
  const incomeValue = incomeEntry?.value?.toLocaleString() || "0";
  const expensesValue = expensesEntry?.value?.toLocaleString() || "0";

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <p className="text-amber-300 font-bold mb-2 funnel-display-reg">
        {label}
      </p>
      <div className="flex items-center space-x-2 mb-2 funnel-display-sm">
        <FiArrowUpRight className="text-teal-400" />
        <span className="text-white">Income:</span>
        <span className="text-teal-400 font-light">${incomeValue}</span>
      </div>
      <div className="flex items-center space-x-2 funnel-display-sm">
        <FiArrowDownLeft className="text-amber-300" />
        <span className="text-white">Expenses:</span>
        <span className="text-amber-300 font-light">${expensesValue}</span>
      </div>
    </div>
  );
};

export default CustomTooltip;
