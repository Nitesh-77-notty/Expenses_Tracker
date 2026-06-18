import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Header from "../components/Header";
import { TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Target } from "lucide-react";

const Analytics = () => {
  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const categoryChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  const categoryData = {
    labels: ["Food", "Shopping", "Transport", "Utilities", "Health", "Other"],
    datasets: [{
      data: [820, 610, 430, 390, 340, 250],
      backgroundColor: [
        "#f97316", // Food
        "#a855f7", // Shopping
        "#3b82f6", // Transport
        "#6366f1", // Utilities
        "#10b981", // Health
        "#9ca3af"  // Other
      ],
      hoverOffset: 10,
      borderWidth: 0,
    }]
  };

  const trendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Spending",
        data: [2100, 1800, 2400, 2200, 2600, 2840],
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#6366f1",
      },
      {
        label: "Budget",
        data: [2500, 2500, 2500, 2500, 2500, 2500],
        borderColor: "#9ca3af",
        borderDash: [5, 5],
        fill: false,
        tension: 0,
        pointRadius: 0,
      }
    ]
  };

  useEffect(() => {
    // Category Doughnut Chart
    if (categoryChartInstance.current) categoryChartInstance.current.destroy();
    categoryChartInstance.current = new Chart(categoryChartRef.current, {
      type: "doughnut",
      data: categoryData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` $${ctx.parsed.toLocaleString()}`
            }
          }
        },
        cutout: "70%"
      }
    });

    // Monthly Trend Line Chart
    if (trendChartInstance.current) trendChartInstance.current.destroy();
    trendChartInstance.current = new Chart(trendChartRef.current, {
      type: "line",
      data: trendData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: { usePointStyle: true }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9ca3af" }
          },
          y: {
            grid: { color: "#f3f4f6" },
            ticks: {
              color: "#9ca3af",
              callback: (v) => "$" + v
            }
          }
        }
      }
    });

    return () => {
      categoryChartInstance.current?.destroy();
      trendChartInstance.current?.destroy();
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <Header />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Monthly Growth</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">+9.2%</p>
              <span className="flex items-center text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight size={10} /> VS LAST MONTH
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Budget Accuracy</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">88%</p>
              <span className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight size={10} /> -2% ERROR
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <PieChart size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Top Category</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-gray-900">Food</p>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                29% OF TOTAL
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-gray-900">Spending Trend</h3>
              <p className="text-xs text-gray-400">Monthly breakdown vs budget limit</p>
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
          <p className="text-indigo-100 text-sm max-w-2xl">
            Your spending on <span className="font-bold text-white">Food & Dining</span> has increased by 15% compared to last month. 
            However, you've managed to stay within your total monthly budget of $4,000. 
            Try setting a specific limit for dining out to save more next month!
          </p>
        </div>
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20px] left-[20%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default Analytics;
