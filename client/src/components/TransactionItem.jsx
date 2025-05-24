import React from "react";
import { FiArrowUpRight, FiArrowDownLeft } from "react-icons/fi";

const TransactionItem = ({ title, amount, category, type }) => {
  return (
    <div className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl">
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-lg bg-${
            type === "income" ? "teal-400/20" : "amber-300/20"
          }`}
        >
          {type === "income" ? (
            <FiArrowDownLeft className="text-teal-400" />
          ) : (
            <FiArrowUpRight className="text-amber-300" />
          )}
        </div>
        <div>
          <div className="text-white funnel-display-sm">{title}</div>
          <div className="text-sm text-white/50 funnel-display-sm">
            {category}
          </div>
        </div>
      </div>
      <div
        className={`text-${
          type === "income" ? "teal-400" : "amber-300"
        } funnel-display-sm`}
      >
        {amount}
      </div>
    </div>
  );
};

export default TransactionItem;
