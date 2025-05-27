import { Link } from "react-router-dom";
import { useState } from "react";
import SummaryCard from "../components/SummaryCard";
import TransactionItem from "../components/TransactionItem";
import ProgressItem from "../components/ProgressItem";
import LineChartComp from "../components/LineChartComp";
import CustomSelect from "../components/CustomSelect";
import {
  FiBell,
  FiDollarSign,
  FiArrowUpCircle,
  FiArrowDownCircle,
  FiPercent,
  FiPlus,
} from "react-icons/fi";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const userName = Cookies.get("userName");

  const sanitizeInput = (input) => {
    return input.replace(/['";\\*\-]/g, "");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanedInput = sanitizeInput(searchTerm.trim());

    if (!cleanedInput) {
      setErrorMessage("Please enter a valid search term");
      return;
    }

    setErrorMessage("");
    console.log(cleanedInput);

    // Can add API
  };
  return (
    <div className="min-h-screen stacked-linear p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white funnel-display-bold">
            Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* <button className="p-2 hover:bg-white/10 rounded-full">
            <FiBell className="text-amber-300 text-xl" />
          </button> */}
          <NavLink
            to="/profile"
            className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-white/10 rounded-full"
          >
            <div className="w-8 h-8 bg-teal-400 rounded-full">
              {/* {profile picture} */}
            </div>
            <span className="text-white funnel-display-reg">{userName}</span>
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Financial Summary */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-4 funnel-display-reg">
              Financial Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 funnel-display-sm">
              <SummaryCard
                title="Total Balance"
                value="$45,230"
                icon={<FiDollarSign className="text-teal-400" />}
              />
              <SummaryCard
                title="Monthly Income"
                value="$12,500"
                icon={<FiArrowUpCircle className="text-green-500" />}
              />
              <SummaryCard
                title="Monthly Expense"
                value="$8,200"
                icon={<FiArrowDownCircle className="text-red-500" />}
              />
              <SummaryCard
                title="Savings Rate"
                value="34%"
                icon={<FiPercent className="text-amber-300" />}
              />
            </div>
          </div>

          {/* Spending Chart */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-amber-300 funnel-display-reg">
                Spending Overview
              </h2>
              <CustomSelect options={["Monthly", "Weekly", "Yearly"]} />
            </div>
            <LineChartComp />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Budget Progress */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h2 className="text-xl font-bold text-amber-300 mb-6">
              Budget Progress
            </h2>
            <div className="space-y-4">
              <ProgressItem
                category="Groceries"
                spent={320}
                limit={500}
                color="teal-400"
              />
              <ProgressItem
                category="Entertainment"
                spent={180}
                limit={300}
                color="amber-300"
              />
              <ProgressItem
                category="Transport"
                spent={150}
                limit={250}
                color="purple-400"
              />
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-amber-300">
                Recent Transactions
              </h2>
              {/* <FiPlus className="text-amber-300 cursor-pointer" /> */}
            </div>
            <div className="space-y-4">
              <TransactionItem
                title="Netflix Subscription"
                amount="$15.99"
                category="Entertainment"
                type="expense"
              />
              <TransactionItem
                title="Salary Deposit"
                amount="$4,500"
                category="Income"
                type="income"
              />
              <TransactionItem
                title="Supermarket"
                amount="$128.75"
                category="Groceries"
                type="expense"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
