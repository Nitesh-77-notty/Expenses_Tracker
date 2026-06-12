import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const categories = [
  { name: "Food & dining", amount: 820, pct: 79, color: "#f97316" },
  { name: "Shopping", amount: 610, pct: 61, color: "#a855f7" },
  { name: "Transport", amount: 430, pct: 43, color: "#3b82f6" },
  { name: "Utilities", amount: 390, pct: 39, color: "#6366f1" },
  { name: "Health", amount: 340, pct: 34, color: "#10b981" },
  { name: "Entertainment", amount: 250, pct: 25, color: "#f59e0b" },
];

const recent = [
  {
    name: "Whole Foods Market",
    cat: "Food & dining",
    date: "Today",
    amount: "$68",
    bg: "#fff3e8",
    iconColor: "#f97316",
    icon: "🛒",
  },
  {
    name: "Uber",
    cat: "Transport",
    date: "Yesterday",
    amount: "$14",
    bg: "#eff6ff",
    iconColor: "#3b82f6",
    icon: "🚗",
  },
  {
    name: "Netflix",
    cat: "Entertainment",
    date: "Jun 12",
    amount: "$18",
    bg: "#fef9ec",
    iconColor: "#f59e0b",
    icon: "📺",
  },
  {
    name: "CVS Pharmacy",
    cat: "Health",
    date: "Jun 11",
    amount: "$43",
    bg: "#ecfdf5",
    iconColor: "#10b981",
    icon: "💊",
  },
  {
    name: "Amazon",
    cat: "Shopping",
    date: "Jun 10",
    amount: "$127",
    bg: "#faf5ff",
    iconColor: "#a855f7",
    icon: "📦",
  },
];

const budgets = [
  { name: "Food & dining", spent: 820, total: 1000, color: "#f97316" },
  { name: "Shopping", spent: 610, total: 700, color: "#a855f7" },
  { name: "Transport", spent: 430, total: 400, color: "#dc2626" },
  { name: "Utilities", spent: 390, total: 500, color: "#6366f1" },
  { name: "Health", spent: 340, total: 400, color: "#10b981" },
];

const Dashboard = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            data: [2100, 1800, 2400, 2200, 2600, 2840],
            backgroundColor: [
              "#eef2ff",
              "#eef2ff",
              "#eef2ff",
              "#eef2ff",
              "#eef2ff",
              "#6366f1",
            ],
            borderRadius: 6,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: { label: (ctx) => ` $${ctx.parsed.y.toLocaleString()}` },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9ca3af", font: { size: 12 } },
            border: { display: false },
          },
          y: {
            grid: { color: "#f3f4f6" },
            ticks: {
              color: "#9ca3af",
              font: { size: 11 },
              callback: (v) => "$" + (v / 1000).toFixed(1) + "k",
            },
            border: { display: false },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, []);

  return (
    <div className="p-6 space-y-5">
      {/* Metric cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Total spent",
            value: "$2,840",
            sub: "↑ 12% vs last month",
            subColor: "text-red-600",
          },
          {
            label: "Budget left",
            value: "$1,160",
            sub: "29% remaining",
            subColor: "text-green-600",
          },
          {
            label: "Transactions",
            value: "47",
            sub: "this month",
            subColor: "text-gray-400",
          },
          {
            label: "Avg / day",
            value: "$94",
            sub: "↑ $8 vs last month",
            subColor: "text-red-600",
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            <p className={`text-sm mt-1 ${m.subColor}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Category breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">
              Spending over time
            </p>
            <div className="flex gap-1">
              {["3M", "6M", "1Y"].map((t) => (
                <button
                  key={t}
                  className={`text-xs px-2.5 py-1 rounded-md border ${
                    t === "6M"
                      ? "bg-indigo-500 text-white border-indigo-500"
                      : "border-gray-200 text-gray-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="relative h-44">
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">By category</p>
            <span className="text-xs text-gray-400">June 2025</span>
          </div>
          <div className="space-y-2.5">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center gap-2.5">
                <span className="w-24 text-xs text-gray-500 truncate">
                  {c.name}
                </span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.pct}%`, background: c.color }}
                  />
                </div>
                <span className="w-12 text-right text-xs font-medium text-gray-800">
                  ${c.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent expenses + Budget progress */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Recent expenses</p>
            <span className="text-xs text-gray-400 cursor-pointer hover:text-indigo-500">
              view all →
            </span>
          </div>
          <div className="space-y-1">
            {recent.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: r.bg }}
                >
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {r.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {r.cat} · {r.date}
                  </p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {r.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Budget progress</p>
            <span className="text-xs text-gray-400">June</span>
          </div>
          <div className="space-y-3.5">
            {budgets.map((b) => {
              const pct = Math.min(100, Math.round((b.spent / b.total) * 100));
              const over = b.spent > b.total;
              return (
                <div key={b.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{b.name}</span>
                    <span style={{ color: over ? "#dc2626" : "#6b7280" }}>
                      ${b.spent} / ${b.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        background: over ? "#dc2626" : b.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
