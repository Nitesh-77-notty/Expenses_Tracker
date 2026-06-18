import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import MainButton from "./MainButton.jsx";
import { Menu, X } from "lucide-react";

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

const NOTIFICATIONS = [
  {
    id: 1,
    text: "Budget 67% used this month",
    time: "2h ago",
    type: "amber",
    unread: true,
  },
  {
    id: 2,
    text: "New transaction: Nike shoes –$89.99",
    time: "Yesterday",
    type: "default",
    unread: true,
  },
  {
    id: 3,
    text: "Monthly report ready for May",
    time: "2d ago",
    type: "blue",
    unread: false,
  },
];

export default function Header({
  title: overrideTitle,
  sidebarWidth = 240,
  onButtonClick,
}) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifs(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifs.filter((n) => n.unread).length;

  // Resolve page info based on path or override prop
  const path = location.pathname;
  const pageInfo = PAGES[path] || {
    title: "SpendWise",
    subtitle: "Manage your finances",
  };
  const displayTitle = overrideTitle || pageInfo.title;
  const displaySubtitle = pageInfo.subtitle;

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  // Generate initials for avatar
  const username = user?.username || "Guest User";
  const userEmail = user?.email || "";
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className="h-16 bg-white border-b border-gray-200 flex items-center md:p-7 gap-4 fixed top-0 right-0 z-40 transition-[left] duration-250 ease-in-out justify-between"
      style={{ left: `${sidebarWidth}px` }}
    >
      <div className="flex items-center gap-2 p-1">
        <div className="md:hidden ">
          <Menu size={16} />
        </div>
        {/* Left: Dynamic Title */}
        <div className="flex-1 min-w-0">
          <div>
            <h1 className="md:text-[20px] font-bold text-gray-900 tracking-tight leading-tight">
              {displayTitle}
            </h1>
            {displaySubtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{displaySubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Notification Icon & Profile Icon */}
      <div className="flex items-center gap-3">
        {/* Notifications Icon with Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifs((v) => !v);
              setShowProfile(false);
            }}
            className={`w-9 h-9 rounded-xl border border-gray-200 cursor-pointer flex items-center justify-center relative transition-all duration-150 hover:bg-gray-50 ${
              showNotifs
                ? "bg-indigo-50 text-indigo-600"
                : "bg-white text-gray-500 hover:text-gray-700"
            }`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifs && (
            <div className="absolute top-full mt-2 right-0 w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-gray-200">
                <span className="font-bold text-sm text-gray-900">
                  Notifications
                </span>
                <button
                  onClick={markAllRead}
                  className="text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifs.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 flex gap-2.5 items-start border-b border-gray-100 transition-colors duration-150 cursor-pointer hover:bg-indigo-50/30 ${
                      n.unread ? "bg-gray-50/70" : "bg-transparent"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        n.unread ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <p className="text-xs text-gray-800 leading-normal">
                        {n.text}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-gray-100">
                <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700 cursor-pointer">
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {pageInfo.buttonName && (
          <MainButton onClick={onButtonClick}>{pageInfo.buttonName}</MainButton>
        )}
        {/* Profile / User Info */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifs(false);
            }}
            className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl border border-gray-200 cursor-pointer transition-all duration-150 hover:bg-gray-50 ${
              showProfile ? "bg-indigo-50" : "bg-white"
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              {initials}
            </div>
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              {username}
            </span>
            <svg
              className="w-3 h-3 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showProfile && (
            <div className="absolute top-full mt-2 right-0 w-[200px] bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {username}
                </p>
                {userEmail && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {userEmail}
                  </p>
                )}
              </div>
              <div className="py-1">
                {["Profile Settings", "Preferences", "Help & Support"].map(
                  (item) => (
                    <button
                      key={item}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
              <div className="border-t border-gray-200 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                >
                  Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
