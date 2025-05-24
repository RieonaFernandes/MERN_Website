import React from "react";

const SummaryCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <div className="flex justify-between items-center">
        <span className="text-white/70 text-sm funnel-display-sm">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-teal-400 mt-2 funnel-display-sm">
        {value}
      </div>
    </div>
  );
};

export default SummaryCard;
