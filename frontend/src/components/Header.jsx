// Header.jsx
import { useState } from "react";

const PAGES = {
  Dashboard: {
    title: "Dashboard",
    subtitle: "Your financial overview",
  },
  Expenses: {
    title: "Expenses",
    subtitle: "Track all your spending",
  },
  Budget: {
    title: "Budget",
    subtitle: "Manage your monthly limits",
  },
  Analytics: {
    title: "Analytics",
    subtitle: "Insights and trends",
  },
  Categories: {
    title: "Categories",
    subtitle: "Organise your spending",
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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Header({
  activePage = "Dashboard",
  sidebarWidth = 240,
}) {
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const unreadCount = notifs.filter((n) => n.unread).length;
  const page = PAGES[activePage] || PAGES.Dashboard;
  const isHome = activePage === "Dashboard";

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <header
      style={{
        height: "64px",
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: "16px",
        position: "fixed",
        top: 0,
        left: `${sidebarWidth}px`,
        right: 0,
        zIndex: 40,
        transition: "left 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Left: page context */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {isHome ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.3px",
              }}
            >
              {getGreeting()}, Alex 👋
            </span>
            <span
              style={{
                fontSize: "12px",
                background: "var(--color-green-bg)",
                color: "var(--color-green)",
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
              }}
            >
              <span>↑</span> On track
            </span>
          </div>
        ) : (
          <div>
            <h1
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.3px",
                lineHeight: 1.2,
              }}
            >
              {page.title}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "var(--color-text-faint)",
                marginTop: "1px",
              }}
            >
              {page.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Center: search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--color-background)",
          border: "1px solid var(--color-border)",
          borderRadius: "9px",
          padding: "7px 12px",
          minWidth: "200px",
          maxWidth: "300px",
          cursor: "text",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border-strong)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--color-border)")
        }
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--color-text-faint)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="21" y2="21" />
        </svg>
        <input
          placeholder="Search transactions…"
          style={{
            border: "none",
            background: "none",
            outline: "none",
            fontSize: "13.5px",
            color: "var(--color-text-primary)",
            width: "100%",
          }}
        />
        <kbd
          style={{
            fontSize: "10px",
            color: "var(--color-text-faint)",
            background: "var(--color-border)",
            padding: "1px 5px",
            borderRadius: "4px",
            fontFamily: "monospace",
          }}
        >
          ⌘K
        </kbd>
      </div>

      {/* Right: actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {/* Date chip */}
        <div
          style={{
            fontSize: "12px",
            color: "var(--color-text-muted)",
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            padding: "5px 10px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          May 2026
        </div>

        {/* Notifications */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifs((v) => !v);
              setShowProfile(false);
            }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "9px",
              border: "1px solid var(--color-border)",
              background: showNotifs
                ? "var(--color-accent-light)"
                : "var(--color-surface)",
              color: showNotifs
                ? "var(--color-accent)"
                : "var(--color-text-muted)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              transition: "all 0.15s",
            }}
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
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  background: "var(--color-red)",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid var(--color-surface)",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifs && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "300px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "14px 16px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <span style={{ fontWeight: 700, fontSize: "14px" }}>
                  Notifications
                </span>
                <button
                  onClick={markAllRead}
                  style={{
                    fontSize: "12px",
                    color: "var(--color-accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Mark all read
                </button>
              </div>
              {notifs.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "12px 16px",
                    display: "flex",
                    gap: "10px",
                    alignItems: "flex-start",
                    borderBottom: "1px solid var(--color-border)",
                    background: n.unread
                      ? "var(--color-background)"
                      : "transparent",
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-accent-light)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = n.unread
                      ? "var(--color-background)"
                      : "transparent")
                  }
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      marginTop: "4px",
                      flexShrink: 0,
                      background: n.unread
                        ? "var(--color-accent)"
                        : "var(--color-border-strong)",
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-text-primary)",
                        lineHeight: 1.4,
                      }}
                    >
                      {n.text}
                    </p>
                    <p
                      style={{
                        fontSize: "11.5px",
                        color: "var(--color-text-faint)",
                        marginTop: "2px",
                      }}
                    >
                      {n.time}
                    </p>
                  </div>
                </div>
              ))}
              <div style={{ padding: "10px 16px" }}>
                <button
                  style={{
                    fontSize: "13px",
                    color: "var(--color-accent)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowProfile((v) => !v);
              setShowNotifs(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 10px 5px 5px",
              borderRadius: "9px",
              border: "1px solid var(--color-border)",
              background: showProfile
                ? "var(--color-accent-light)"
                : "var(--color-surface)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--color-accent), #818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              AJ
            </div>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                whiteSpace: "nowrap",
              }}
            >
              Alex Johnson
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-faint)"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: "200px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "12px",
                boxShadow: "var(--shadow-lg)",
                overflow: "hidden",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Alex Johnson
                </p>
                <p
                  style={{ fontSize: "12px", color: "var(--color-text-faint)" }}
                >
                  alex@example.com
                </p>
              </div>
              {["Profile Settings", "Preferences", "Help & Support"].map(
                (item) => (
                  <button
                    key={item}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      fontSize: "13.5px",
                      color: "var(--color-text-primary)",
                      cursor: "pointer",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--color-background)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "none")
                    }
                  >
                    {item}
                  </button>
                ),
              )}
              <div style={{ borderTop: "1px solid var(--color-border)" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "none",
                    border: "none",
                    textAlign: "left",
                    fontSize: "13.5px",
                    color: "var(--color-red)",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-red-bg)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
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
