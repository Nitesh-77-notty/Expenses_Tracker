import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ReceiptText,
  Tags,
  Wallet,
  LogOut,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Expenses", path: "/expenses", icon: ReceiptText },
    { name: "Categories", path: "/categories", icon: Tags },
    { name: "Budgets", path: "/budgets", icon: Wallet },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white border-r border-gray-200 flex flex-col justify-between z-50">
      {/* Top Section: Logo */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-200">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">
            SpendWise
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-6 px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-gray-500"
                      }`}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User & Logout */}
      <div className="p-4 border-t border-gray-200 space-y-3">
        {/* User Profile Info */}
        <div className="flex items-center gap-3 px-2 py-1.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {getInitials(user?.username)}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-900 truncate">
              {user?.username || "Guest User"}
            </span>
            <span className="text-[10px] text-gray-400 truncate">
              {user?.email || "No email"}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-red-500 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
