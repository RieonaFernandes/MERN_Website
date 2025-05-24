import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const CustomSelect = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Monthly");

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 border border-white/20 rounded-xl py-2 text-gray-300 w-40 cursor-pointer"
      >
        <div className="flex items-center justify-center space-x-6">
          <span className="text-white funnel-display-reg">{selected}</span>
          {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-40 bg-white/5 border border-gray-600 rounded-xl shadow-lg funnel-display-sm">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-gray-300 hover:bg-teal-500 hover:text-white cursor-pointer rounded-xl"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
