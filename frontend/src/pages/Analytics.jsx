import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import {
  TrendingUp,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
} from "lucide-react";
import { useExpenses } from "../context/ExpenseContext";
import { useBudgets } from "../context/BudgetContext";
import { useCategories } from "../context/CategoryContext";

const Analytics = () => {
  const { fetchAllExpenses } = useExpenses();
  const { budgets, activeBudget, fetchBudgets, fetchBudgetByMonth } =
    useBudgets();
  const { categories } = useCategories();

  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const categoryChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    growthPct: 0,
    growthDirection: "up",
    accuracy: 100,
    accuracyLabel: "ON BUDGET",
    accuracySub: "0% error",
    topCategoryName: "N/A",
    topCategoryPct: 0,
    topCategoryAmount: 0,
    currentBudgetLimit: 0,
  });

  const [distributionData, setDistributionData] = useState({
    labels: [],
    values: [],
    colors: [],
  });
  const [trendData, setTrendData] = useState({
    labels: [],
    spending: [],
    budget: [],
  });

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        // Ensure budgets are loaded
        await fetchBudgets(currentYear);
        const budget = await fetchBudgetByMonth(currentMonth, currentYear);
        const budgetLimit = budget ? budget.monthlyLimit : 0;

        // Current month and last month ranges
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

        // 6 months ago range
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

        const currentTotal = expensesCurrent.reduce(
          (sum, e) => sum + e.amount,
          0,
        );
        const lastTotal = expensesLast.reduce((sum, e) => sum + e.amount, 0);

        // 1. Monthly growth
        let growthPct = 0;
        let growthDirection = "up";
        if (lastTotal > 0) {
          growthPct = Math.round(
            ((currentTotal - lastTotal) / lastTotal) * 100,
          );
          if (growthPct < 0) {
            growthDirection = "down";
            growthPct = Math.abs(growthPct);
          }
        }

        // 2. Budget accuracy
        let accuracy = 100;
        let accuracyLabel = "ON BUDGET";
        let accuracySub = "0% error";
        if (budgetLimit > 0) {
          const usedPct = Math.round((currentTotal / budgetLimit) * 100);
          accuracy = Math.min(100, Math.max(0, 100 - Math.abs(100 - usedPct)));
          if (usedPct <= 100) {
            accuracyLabel = "UNDER BUDGET";
            accuracySub = `${100 - usedPct}% remaining`;
          } else {
            accuracyLabel = "OVER BUDGET";
            accuracySub = `${usedPct - 100}% over limit`;
          }
        } else {
          accuracyLabel = "NO BUDGET SET";
          accuracySub = "Set a budget limit";
        }

        // 3. Top category & Doughnut breakdown
        const categoryMap = {};
        categories.forEach((cat) => {
          categoryMap[cat._id] = {
            name: cat.name,
            color: cat.color || "#6366f1",
            spent: 0,
          };
        });

        expensesCurrent.forEach((exp) => {
          const catId =
            typeof exp.categoryId === "object"
              ? exp.categoryId?._id
              : exp.categoryId;
          if (categoryMap[catId]) {
            categoryMap[catId].spent += exp.amount;
          }
        });

        const activeCategories = Object.values(categoryMap)
          .filter((c) => c.spent > 0)
          .sort((a, b) => b.spent - a.spent);

        let topCategoryName = "N/A";
        let topCategoryPct = 0;
        let topCategoryAmount = 0;

        if (activeCategories.length > 0) {
          topCategoryName = activeCategories[0].name;
          topCategoryAmount = activeCategories[0].spent;
          topCategoryPct =
            currentTotal > 0
              ? Math.round((topCategoryAmount / currentTotal) * 100)
              : 0;
        }

        setStats({
          growthPct,
          growthDirection,
          accuracy,
          accuracyLabel,
          accuracySub,
          topCategoryName,
          topCategoryPct,
          topCategoryAmount,
          currentBudgetLimit: budgetLimit,
          currentTotal,
        });

        // Setup doughnut data
        const doughnutLabels = activeCategories.map((c) => c.name);
        const doughnutValues = activeCategories.map((c) => c.spent);
        const doughnutColors = activeCategories.map((c) => c.color);
        setDistributionData({
          labels: doughnutLabels,
          values: doughnutValues,
          colors: doughnutColors,
        });

        // Setup line trend data
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
        const lineLabels = [];
        const lineSpending = [];
        const lineBudgets = [];

        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const mIndex = d.getMonth() + 1;
          const yIndex = d.getFullYear();
          lineLabels.push(months[d.getMonth()]);

          // Aggregated spend for that month
          const mExpenses = expenses6M.filter((e) => {
            const date = new Date(e.date);
            return (
              date.getMonth() === d.getMonth() &&
              date.getFullYear() === d.getFullYear()
            );
          });
          lineSpending.push(mExpenses.reduce((sum, e) => sum + e.amount, 0));

          // Budget limit for that month
          const mBudget = budgets.find(
            (b) => b.month === mIndex && b.year === yIndex,
          );
          lineBudgets.push(mBudget ? mBudget.monthlyLimit : budgetLimit); // fallback to active limit
        }

        setTrendData({
          labels: lineLabels,
          spending: lineSpending,
          budget: lineBudgets,
        });
      } catch (err) {
        console.error("Failed to load analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      loadAnalyticsData();
    }
  }, [categories]);

  useEffect(() => {
    if (loading || !categoryChartRef.current || !trendChartRef.current) return;

    // Doughnut chart
    if (categoryChartInstance.current) categoryChartInstance.current.destroy();
    categoryChartInstance.current = new Chart(categoryChartRef.current, {
      type: "doughnut",
      data: {
        labels:
          distributionData.labels.length > 0
            ? distributionData.labels
            : ["No Data"],
        datasets: [
          {
            data:
              distributionData.values.length > 0
                ? distributionData.values
                : [1],
            backgroundColor:
              distributionData.colors.length > 0
                ? distributionData.colors
                : ["#e5e7eb"],
            hoverOffset: 10,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 },
            },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                if (distributionData.values.length === 0) return " $0.00";
                return ` $${ctx.parsed.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
              },
            },
          },
        },
        cutout: "70%",
      },
    });

    // Line Trend Chart
    if (trendChartInstance.current) trendChartInstance.current.destroy();
    trendChartInstance.current = new Chart(trendChartRef.current, {
      type: "line",
      data: {
        labels: trendData.labels,
        datasets: [
          {
            label: "Spending",
            data: trendData.spending,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99, 102, 241, 0.05)",
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: "#6366f1",
          },
          {
            label: "Budget Limit",
            data: trendData.budget,
            borderColor: "#9ca3af",
            borderDash: [5, 5],
            fill: false,
            tension: 0,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: { usePointStyle: true },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9ca3af" },
          },
          y: {
            grid: { color: "#f3f4f6" },
            ticks: {
              color: "#9ca3af",
              callback: (v) => "$" + v.toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      categoryChartInstance.current?.destroy();
      trendChartInstance.current?.destroy();
    };
  }, [loading, distributionData, trendData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Growth</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">
                {stats.growthDirection === "up" ? "+" : "-"}
                {stats.growthPct}%
              </p>
              <span
                className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  stats.growthDirection === "up" && stats.growthPct > 0
                    ? "text-red-500 bg-red-50"
                    : "text-green-500 bg-green-50"
                }`}
              >
                {stats.growthDirection === "up" ? (
                  <ArrowUpRight size={10} />
                ) : (
                  <ArrowDownRight size={10} />
                )}{" "}
                VS LAST MONTH
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">
              Budget Target Accuracy
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">
                {stats.accuracy}%
              </p>
              <span
                className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  stats.accuracyLabel === "OVER BUDGET"
                    ? "text-red-500 bg-red-50"
                    : "text-emerald-500 bg-emerald-50"
                }`}
              >
                {stats.accuracySub}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <PieChart size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Top Category</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900 truncate max-w-[120px]">
                {stats.topCategoryName}
              </p>
              {stats.topCategoryPct > 0 && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">
                  {stats.topCategoryPct}% OF TOTAL
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Spending Trend
              </h3>
              <p className="text-xs text-gray-400">
                Monthly breakdown vs budget limit
              </p>
            </div>
          </div>
          <div className="h-72 relative">
            <canvas ref={trendChartRef} />
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-base font-bold text-gray-900">Distribution</h3>
            <p className="text-xs text-gray-400">Spending by category</p>
          </div>
          <div className="h-72 relative">
            <canvas ref={categoryChartRef} />
          </div>
        </div>
      </div>

      {/* Insight Card */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-2">Smart Insight</h3>
          {stats.topCategoryName !== "N/A" ? (
            <p className="text-indigo-100 text-sm max-w-2xl">
              Your spending on{" "}
              <span className="font-bold text-white">
                {stats.topCategoryName}
              </span>{" "}
              has reached{" "}
              <span className="font-bold text-white">
                ${stats.topCategoryAmount.toFixed(2)}
              </span>
              , which represents{" "}
              <span className="font-bold text-white">
                {stats.topCategoryPct}%
              </span>{" "}
              of your total monthly spending.{" "}
              {stats.currentBudgetLimit > 0 ? (
                stats.currentTotal <= stats.currentBudgetLimit ? (
                  <span>
                    Great job! You've stayed within your total monthly budget
                    limit of ${stats.currentBudgetLimit.toLocaleString()}.
                  </span>
                ) : (
                  <span>
                    You've exceeded your monthly budget limit by $
                    {Math.abs(
                      stats.currentBudgetLimit - stats.currentTotal,
                    ).toFixed(2)}
                    . Consider reviewing your recent transactions to cut back.
                  </span>
                )
              ) : (
                <span>
                  You don't have a monthly budget set yet. Setting one in the
                  Budgets section can help you manage your expenses more
                  efficiently.
                </span>
              )}
            </p>
          ) : (
            <p className="text-indigo-100 text-sm max-w-2xl">
              No transactions recorded for this month. Start logging your
              expenses in the Expenses page to generate smart financial
              insights.
            </p>
          )}
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20px] left-[20%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default Analytics;
