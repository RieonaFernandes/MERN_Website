import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-orange-500">Cromwell</span>
          </div>

          {/* Desktop View Navigation */}
          <div className="hidden md:block">
            <ul className="ml-4 flex items-center space-x-2">
              <NavItem to="/home" text="Home" />
              <NavItem to="/about" text="About" />
              <NavItem to="/profile" text="Profile" />
            </ul>
          </div>

          {/* Mobile View Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-orange-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Nav */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-100">
          <MobileNavItem
            to="/home"
            text="Home"
            onClick={() => setIsOpen(false)}
          />
          <MobileNavItem
            to="/about"
            text="About"
            onClick={() => setIsOpen(false)}
          />
          <MobileNavItem
            to="/profile"
            text="Profile"
            onClick={() => setIsOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
}

const NavItem = ({ to, text }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-gray-600 hover:text-orange-500 font-medium ${
          isActive
            ? "bg-orange-100 text-orange-600 shadow-sm"
            : "hover:bg-orange-50"
        }`
      }
    >
      {text}
    </NavLink>
  </li>
);

// Mobile Nav Item Component
const MobileNavItem = ({ to, text, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? "bg-orange-50 text-orange-600"
          : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
      }`
    }
  >
    {text}
  </NavLink>
);
