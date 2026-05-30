// StatsCard.jsx
// A single metric card with trend indicator, icon, and sparkline-style decoration

export default function StatsCard({
  label,
  value,
  trend, // e.g. "+12%" or "-8%"
  trendUp, // boolean
  icon,
  accentColor = "var(--color-accent)",
  accentBg = "var(--color-accent-light)",
  note, // optional sub-note
}) {
  const trendColor = trendUp ? "var(--color-green)" : "var(--color-red)";
  const trendBg = trendUp ? "var(--color-green-bg)" : "var(--color-red-bg)";

  return (
    <div
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px 22px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "var(--shadow-sm)",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-md)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Decorative background circle */}
      <div
        style={{
          position: "absolute",
          top: "-24px",
          right: "-24px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: accentBg,
          opacity: 0.7,
        }}
      />

      {/* Top row: icon + trend */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: accentBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: accentColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              color: trendColor,
              background: trendBg,
              padding: "3px 8px",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              gap: "2px",
            }}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>

      {/* Value */}
      <div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.8px",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--color-text-muted)",
            marginTop: "4px",
            fontWeight: 500,
          }}
        >
          {label}
        </div>
        {note && (
          <div
            style={{
              fontSize: "11.5px",
              color: "var(--color-text-faint)",
              marginTop: "2px",
            }}
          >
            {note}
          </div>
        )}
      </div>
    </div>
  );
}
