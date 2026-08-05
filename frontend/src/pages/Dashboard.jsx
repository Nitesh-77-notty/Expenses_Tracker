import Chart from "chart.js/auto";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenses } from "../context/ExpenseContext";
import { useBudgets } from "../context/BudgetContext";
import { useCategories } from "../context/CategoryContext";

const CATEGORY_BUDGET_FACTORS = {
  "Food & dining": 0.25,
  Shopping: 0.175,
  Transport: 0.1,
  Utilities: 0.125,
  Health: 0.1,
  Entertainment: 0.1,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchAllExpenses } = useExpenses();
  const { activeBudget, fetchBudgetByMonth } = useBudgets();
  const { categories } = useCategories();

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalSpent: 0,
    spentSub: "0% vs last month",
    spentSubColor: "text-gray-400",
    budgetLeft: 0,
    budgetSub: "0% remaining",
    budgetSubColor: "text-gray-400",
    transactionsCount: 0,
    avgPerDay: 0,
    avgSub: "$0 vs last month",
    avgSubColor: "text-gray-400",
  });

  const [recentExpenses, setRecentExpenses] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [budgetProgressList, setBudgetProgressList] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], values: [] });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        // Fetch active budget
        const budget = await fetchBudgetByMonth(currentMonth, currentYear);
        const budgetLimit = budget ? budget.monthlyLimit : 0;

        // Date ranges
        const startOfMonth = new Date(
          currentYear,
          currentMonth - 1,
          1,
        ).toISOString();
        const endOfMonth = new Date(
          currentYear,
          currentMonth,
          0,
          23,
          59,
          59,
        ).toISOString();

        const startOfLastMonth = new Date(
          currentYear,
          currentMonth - 2,
          1,
        ).toISOString();
        const endOfLastMonth = new Date(
          currentYear,
          currentMonth - 1,
          0,
          23,
          59,
          59,
        ).toISOString();

        // Past 6 months range
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const [expensesCurrent, expensesLast, expenses6M] = await Promise.all([
          fetchAllExpenses({ startDate: startOfMonth, endDate: endOfMonth }),
          fetchAllExpenses({
            startDate: startOfLastMonth,
            endDate: endOfLastMonth,
          }),
          fetchAllExpenses({ startDate: sixMonthsAgo.toISOString() }),
        ]);

        // 1. Total spent this month
        const currentMonthTotal = expensesCurrent.reduce(
          (sum, e) => sum + e.amount,
          0,
        );
        const lastMonthTotal = expensesLast.reduce(
          (sum, e) => sum + e.amount,
          0,
        );

        const spentDiff =
          lastMonthTotal > 0
            ? Math.round(
                ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100,
              )
            : 0;
        const spentSub =
          lastMonthTotal > 0
            ? `${spentDiff >= 0 ? "↑" : "↓"} ${Math.abs(spentDiff)}% vs last month`
            : "No data for last month";
        const spentSubColor =
          spentDiff >= 0 && lastMonthTotal > 0
            ? "text-red-600"
            : "text-green-600";

        // 2. Budget left
        const budgetLeft = budgetLimit - currentMonthTotal;
        const pctRemaining =
          budgetLimit > 0
            ? Math.max(0, Math.round((budgetLeft / budgetLimit) * 100))
            : 0;
        const budgetSub =
          budgetLimit > 0
            ? `${pctRemaining}% remaining`
            : "No monthly budget set";
        const budgetSubColor =
          pctRemaining > 20
            ? "text-green-600"
            : pctRemaining > 0
              ? "text-amber-600"
              : "text-red-600";

        // 3. Transactions count
        const transactionsCount = expensesCurrent.length;

        // 4. Average per day
        const elapsedDays = now.getDate();
        const avgPerDay =
          transactionsCount > 0 ? currentMonthTotal / elapsedDays : 0;

        const daysInLastMonth = new Date(
          currentYear,
          currentMonth - 1,
          0,
        ).getDate();
        const avgLastMonth =
          lastMonthTotal > 0 ? lastMonthTotal / daysInLastMonth : 0;
        const avgDiff = Math.round(avgPerDay - avgLastMonth);
        const avgSub =
          lastMonthTotal > 0
            ? `${avgDiff >= 0 ? "↑" : "↓"} $${Math.abs(avgDiff)} vs last month`
            : "No data for last month";
        const avgSubColor =
          avgDiff >= 0 && lastMonthTotal > 0
            ? "text-red-600"
            : "text-green-600";

        setMetrics({
          totalSpent: currentMonthTotal,
          spentSub,
          spentSubColor,
          budgetLeft,
          budgetSub,
          budgetSubColor,
          transactionsCount,
          avgPerDay,
          avgSub,
          avgSubColor,
        });

        // 5. Recent expenses (last 5)
        const recent = expensesCurrent.slice(0, 5).map((e) => {
          const cat = typeof e.categoryId === "object" ? e.categoryId : null;
          return {
            _id: e._id,
            name: e.description,
            cat: cat?.name || "Unknown",
            date: new Date(e.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            amount: `$${e.amount.toFixed(2)}`,
            bg: (cat?.color || "#6366f1") + "18",
            icon: cat?.emoji || "📦",
          };
        });
        setRecentExpenses(recent);

        // 6. By Category list
        const categoryData = categories
          .map((cat) => {
            const catExpenses = expensesCurrent.filter((e) => {
              const catId =
                typeof e.categoryId === "object"
                  ? e.categoryId?._id
                  : e.categoryId;
              return catId === cat._id;
            });
            const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);
            const pct =
              currentMonthTotal > 0
                ? Math.round((catTotal / currentMonthTotal) * 100)
                : 0;
            return {
              name: cat.name,
              amount: catTotal,
              pct,
              color: cat.color || "#6366f1",
            };
          })
          .filter((c) => c.amount > 0)
          .sort((a, b) => b.amount - a.amount);
        setCategoryList(categoryData);

        // 7. Budget Progress (top categories)
        const progressList = categories
          .map((cat) => {
            const factor = CATEGORY_BUDGET_FACTORS[cat.name] || 0.15;
            const target = Math.round(budgetLimit * factor);

            const catExpenses = expensesCurrent.filter((e) => {
              const catId =
                typeof e.categoryId === "object"
                  ? e.categoryId?._id
                  : e.categoryId;
              return catId === cat._id;
            });
            const catTotal = catExpenses.reduce((sum, e) => sum + e.amount, 0);

            return {
              name: cat.name,
              spent: catTotal,
              total: target,
              color: cat.color || "#6366f1",
            };
          })
          .filter((c) => c.spent > 0 || c.total > 0)
          .slice(0, 5);
        setBudgetProgressList(progressList);

        // 8. 6 Months Chart data aggregation
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const labels = [];
        const values = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          labels.push(months[d.getMonth()]);

          const mExpenses = expenses6M.filter((e) => {
            const date = new Date(e.date);
            return (
              date.getMonth() === d.getMonth() &&
              date.getFullYear() === d.getFullYear()
            );
          });
          const mTotal = mExpenses.reduce((sum, e) => sum + e.amount, 0);
          values.push(mTotal);
        }
        setChartData({ labels, values });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      loadDashboardData();
    }
  }, [categories]);

  useEffect(() => {
    if (loading || !chartRef.current || chartData.labels.length === 0) return;

    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.values,
            backgroundColor: chartData.values.map((_, i) =>
              i === chartData.values.length - 1 ? "#6366f1" : "#eef2ff",
            ),
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
              callback: (v) => "$" + v.toLocaleString(),
            },
            border: { display: false },
          },
        },
      },
    });
    return () => chartInstance.current?.destroy();
  }, [loading, chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total spent",
            value: `$${metrics.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            sub: metrics.spentSub,
            subColor: metrics.spentSubColor,
          },
          {
            label: "Budget left",
            value: `$${metrics.budgetLeft.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            sub: metrics.budgetSub,
            subColor: metrics.budgetSubColor,
          },
          {
            label: "Transactions",
            value: metrics.transactionsCount.toString(),
            sub: "this month",
            subColor: "text-gray-400",
          },
          {
            label: "Avg / day",
            value: `$${metrics.avgPerDay.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            sub: metrics.avgSub,
            subColor: metrics.avgSubColor,
          },
        ].map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            <p className={`text-sm mt-1 ${m.subColor}`}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">
              Spending over time
            </p>
            <div className="flex gap-1">
              <span className="text-xs px-2.5 py-1 rounded-md border border-indigo-500 bg-indigo-500 text-white font-medium">
                6M
              </span>
            </div>
          </div>
          <div className="relative h-44">
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">By category</p>
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <div className="space-y-2.5 max-h-[176px] overflow-y-auto pr-1">
            {categoryList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No transactions this month
              </p>
            ) : (
              categoryList.map((c) => (
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
                  <span className="w-16 text-right text-xs font-medium text-gray-800">
                    ${c.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent expenses + Budget progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Recent expenses</p>
            <span
              onClick={() => navigate("/expenses")}
              className="text-xs text-gray-400 cursor-pointer hover:text-indigo-500 font-medium"
            >
              view all →
            </span>
          </div>
          <div className="space-y-1">
            {recentExpenses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No recent transactions
              </p>
            ) : (
              recentExpenses.map((r) => (
                <div
                  key={r._id}
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
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-900">Budget progress</p>
            <span className="text-xs text-gray-400">This Month</span>
          </div>
          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            {budgetProgressList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">
                No budget limit set
              </p>
            ) : (
              budgetProgressList.map((b) => {
                const pct =
                  b.total > 0
                    ? Math.min(100, Math.round((b.spent / b.total) * 100))
                    : 0;
                const over = b.spent > b.total;
                return (
                  <div key={b.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-gray-700">
                        {b.name}
                      </span>
                      <span
                        style={{
                          color: over && b.total > 0 ? "#dc2626" : "#6b7280",
                        }}
                      >
                        ${b.spent.toFixed(2)} / ${b.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${b.total > 0 ? pct : 0}%`,
                          background: over && b.total > 0 ? "#dc2626" : b.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
