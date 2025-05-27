import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiPieChart,
  FiDollarSign,
  FiCalendar,
  FiSettings,
  FiTrendingUp,
  FiMenu,
  FiBriefcase,
} from "react-icons/fi";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import logo from "../assets/logo.png";

export default function Navigation({ isOpen, setIsOpen, onToggle }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block left-0 top-0 bg-white/10 rounded-lg backdrop-blur-lg py-15 z-50 
          shadow-lg transition-all duration-300 ${isOpen ? "w-50" : "w-20"}`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Navigation Items */}
          <nav className="flex-1">
            <ul className="space-y-1">
              <SidebarItem
                to="/home"
                text="Dashboard"
                icon={<FiPieChart />}
                isOpen={isOpen}
              />
              <SidebarItem
                to="/accounts"
                text="Accounts"
                icon={<FiBriefcase />}
                isOpen={isOpen}
              />
              <SidebarItem
                to="/budgets"
                text="Budgets"
                icon={<FiDollarSign />}
                isOpen={isOpen}
              />
              <SidebarItem
                to="/transactions"
                text="Transactions"
                icon={<FiTrendingUp />}
                isOpen={isOpen}
              />
              <SidebarItem
                to="/plans"
                text="Plans"
                icon={<FiCalendar />}
                isOpen={isOpen}
              />
              <SidebarItem
                to="/settings"
                text="Settings"
                icon={<FiSettings />}
                isOpen={isOpen}
              />
              {/* Collapse Button */}
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all
                              text-gray-300 hover:bg-white/5 hover:text-teal-400 cursor-pointer
                              ${isOpen ? "relative -right-31 -bottom-28" : ""}
                              `}
                >
                  {/* <FiMenu className={`absolute w-6 h-6 right-3 bottom-3`} /> */}
                  <span className="text-xl">
                    {isOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
                  </span>
                  {isOpen && (
                    <span className="text-sm funnel-display-sm"></span>
                  )}
                </button>
              </div>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-orange-100 z-50 text-orange-500"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar */}
      <aside
        className={`md:hidden left-0 top-0 h-screen bg-white/10 backdrop-blur-lg border-r border-orange-100 z-40 
        shadow-lg transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } w-50`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center mb-8">
            <img src={logo} alt="FinTrack logo" className="w-16 h-16" />
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              <MobileSidebarItem
                to="/home"
                text="Dashboard"
                icon={<FiPieChart />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileSidebarItem
                to="/accounts"
                text="Accounts"
                icon={<FiBriefcase />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileSidebarItem
                to="/budgets"
                text="Budgets"
                icon={<FiDollarSign />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileSidebarItem
                to="/transactions"
                text="Transactions"
                icon={<FiTrendingUp />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileSidebarItem
                to="/plans"
                text="Plans"
                icon={<FiCalendar />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <MobileSidebarItem
                to="/settings"
                text="Settings"
                icon={<FiSettings />}
                onClick={() => setIsMobileMenuOpen(false)}
              />
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

const SidebarItem = ({ to, text, icon, isOpen }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-xl transition-all
        ${
          isActive
            ? "bg-white/5 text-amber-300 font-semibold shadow-sm"
            : "text-gray-300 hover:bg-white/5 hover:text-teal-400"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {isOpen && <span className="text-sm funnel-display-sm">{text}</span>}
    </NavLink>
  </li>
);

// Mobile Nav Item Component
const MobileSidebarItem = ({ to, text, icon, onClick }) => (
  <li>
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-xl
        ${
          isActive
            ? "bg-white/5 text-amber-300 font-semibold shadow-sm"
            : "text-gray-300 hover:bg-white/5 hover:text-teal-400"
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm funnel-display-sm">{text}</span>
    </NavLink>
  </li>
);
