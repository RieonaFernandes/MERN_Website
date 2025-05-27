import React from "react";

const ProgressItem = ({ category, spent, limit, color }) => {
  return (
    <div>
      <div className="flex justify-between text-sm funnel-display-sm text-white/80 mb-1">
        <span>{category}</span>
        <span>
          ${spent} / ${limit}
        </span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-2">
        <div
          className={`bg-${color} h-2 rounded-full`}
          style={{ width: `${(spent / limit) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressItem;
