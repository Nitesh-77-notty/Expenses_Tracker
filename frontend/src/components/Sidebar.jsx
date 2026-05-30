// Sidebar.jsx
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Expenses",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <line x1="9" y1="12" x2="15" y2="12" />
        <line x1="9" y1="16" x2="13" y2="16" />
      </svg>
    ),
    badge: "12",
  },
  {
    label: "Budget",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Analytics",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    badge: null,
  },
  {
    label: "Categories",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
    badge: null,
  },
];

const CATEGORIES = [
  { label: "Food", color: "var(--color-category-food)" },
  { label: "Transport", color: "var(--color-category-transport)" },
  { label: "Shopping", color: "var(--color-category-shopping)" },
  { label: "Health", color: "var(--color-category-health)" },
  { label: "Entertainment", color: "var(--color-category-entertainment)" },
];

export default function Sidebar({ activeItem = "Dashboard", onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      style={{
        width: collapsed ? "68px" : "240px",
        minHeight: "100vh",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          padding: collapsed ? "0 16px" : "0 20px",
          borderBottom: "1px solid var(--color-border)",
          gap: "10px",
          justifyContent: collapsed ? "center" : "flex-start",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "9px",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <path d="M12 6v2m0 8v2M8.5 9.5l1.5 1.5M14 14l1.5 1.5M6 12h2m8 0h2M9.5 14.5l-1.5 1.5M14.5 9.5l1.5-1.5" />
          </svg>
        </div>
        {!collapsed && (
          <span
            style={{
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.4px",
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            SpendWise
          </span>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-faint)",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "6px",
              transition: "color 0.15s",
            }}
            title="Collapse"
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
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-faint)",
              display: "flex",
              alignItems: "center",
              padding: "4px",
            }}
            title="Expand"
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
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
            </svg>
          </button>
        )}
      </div>

      {/* Nav section label */}
      {!collapsed && (
        <div style={{ padding: "20px 20px 8px", flexShrink: 0 }}>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-faint)",
            }}
          >
            Main
          </span>
        </div>
      )}
      {collapsed && <div style={{ height: "28px", flexShrink: 0 }} />}

      {/* Nav Items */}
      <nav
        style={{
          flex: 1,
          padding: "0 10px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === activeItem;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate?.(item.label)}
              title={collapsed ? item.label : ""}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: collapsed ? "10px" : "9px 12px",
                borderRadius: "9px",
                marginBottom: "2px",
                border: "none",
                cursor: "pointer",
                background: isActive
                  ? "var(--color-accent-light)"
                  : "transparent",
                color: isActive
                  ? "var(--color-accent)"
                  : "var(--color-text-muted)",
                fontWeight: isActive ? 600 : 500,
                fontSize: "14px",
                textAlign: "left",
                transition: "all 0.15s",
                justifyContent: collapsed ? "center" : "flex-start",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "var(--color-background)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ flexShrink: 0, display: "flex" }}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span style={{ whiteSpace: "nowrap" }}>{item.label}</span>
                  {item.badge && (
                    <span
                      style={{
                        marginLeft: "auto",
                        background: isActive
                          ? "var(--color-accent)"
                          : "var(--color-border-strong)",
                        color: isActive ? "#fff" : "var(--color-text-muted)",
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "1px 7px",
                        borderRadius: "20px",
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}

        {/* Add Expense CTA */}
        <button
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: collapsed ? "10px" : "9px 12px",
            borderRadius: "9px",
            marginTop: "4px",
            border: "1.5px dashed var(--color-border-strong)",
            cursor: "pointer",
            background: "transparent",
            color: "var(--color-text-faint)",
            fontWeight: 500,
            fontSize: "14px",
            transition: "all 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent)";
            e.currentTarget.style.color = "var(--color-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border-strong)";
            e.currentTarget.style.color = "var(--color-text-faint)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          {!collapsed && <span>Add Expense</span>}
        </button>

        {/* Quick categories */}
        {!collapsed && (
          <div style={{ marginTop: "24px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-faint)",
                padding: "0 12px",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Categories
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "7px 12px",
                  borderRadius: "9px",
                  border: "none",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  fontSize: "13.5px",
                  fontWeight: 400,
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-background)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: cat.color,
                    flexShrink: 0,
                  }}
                />
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* User section */}
      <div
        style={{
          padding: collapsed ? "12px 10px" : "12px 10px",
          borderTop: "1px solid var(--color-border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 10px",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "background 0.15s",
            justifyContent: collapsed ? "center" : "flex-start",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-background)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, var(--color-accent), #818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "13px",
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            AJ
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Alex Johnson
              </div>
              <div
                style={{
                  fontSize: "11.5px",
                  color: "var(--color-text-faint)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                alex@example.com
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
