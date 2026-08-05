import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import MainButton from "./MainButton.jsx";
import { Menu } from "lucide-react";

const PAGES = {
  "/": {
    title: "Dashboard",
    subtitle: "Your financial overview",
    buttonName: null,
  },
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Your financial overview",
    buttonName: null,
  },
  "/expenses": {
    title: "Expenses",
    subtitle: "Track all your spending",
    buttonName: "Add expense",
  },
  "/budgets": {
    title: "Budget",
    subtitle: "Manage your monthly limits",
    buttonName: "Add budget",
  },
  "/analytics": {
    title: "Analytics",
    subtitle: "Insights and trends",
    buttonName: null,
  },
  "/categories": {
    title: "Categories",
    subtitle: "Organise your spending",
    buttonName: "Add category",
  },
};

export default function Header({
  title: overrideTitle,
  sidebarWidth = 240,
  onButtonClick: propOnButtonClick,
  onMenuClick,
}) {
  const location = useLocation();
  const { user } = useAuth();
  const uiContext = useUI();
  const onButtonClick = propOnButtonClick || uiContext?.onButtonClick;

  // Resolve page info based on path or override prop.
  // Strip a trailing slash (except for root "/") so "/expenses/" still
  // matches the "/expenses" entry instead of silently falling back to
  // the default (buttonName: null) and hiding the action button.
  const path =
    location.pathname.length > 1
      ? location.pathname.replace(/\/+$/, "")
      : location.pathname;
  const pageInfo = PAGES[path] || {
    title: "SpendWise",
    subtitle: "Manage your finances",
  };
  const displayTitle = overrideTitle || pageInfo.title;
  const displaySubtitle = pageInfo.subtitle;

  // Generate initials for avatar
  const username = user?.username || "Guest User";
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-7 gap-4 fixed top-0 right-0 left-0 lg:left-64 z-40 transition-[left] duration-250 ease-in-out justify-between">
      <div className="flex items-center gap-2 p-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer lg:hidden mr-1 shrink-0"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        {/* Left: Dynamic Title */}
        <div className="flex-1 min-w-0">
          <div>
            <h1 className="text-base sm:text-lg md:text-[20px] font-bold text-gray-900 tracking-tight leading-tight truncate">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="hidden sm:block text-[10px] sm:text-xs text-gray-400 mt-0.5 truncate">
                {displaySubtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Action Button & Logged-in User */}
      <div className="flex items-center gap-3">
        {pageInfo.buttonName && (
          <MainButton onClick={onButtonClick}>
            <span className="hidden sm:inline">{pageInfo.buttonName}</span>
            <span className="sm:hidden text-lg font-bold">+</span>
          </MainButton>
        )}

        {/* Logged-in user (static, no dropdown) */}
        <div className="flex items-center gap-2 pl-1.5 pr-1.5 sm:pr-2.5 py-1 rounded-xl border border-gray-200 bg-white">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm shrink-0">
            {initials}
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-gray-900 whitespace-nowrap">
            {username}
          </span>
        </div>
      </div>
    </header>
  );
}
