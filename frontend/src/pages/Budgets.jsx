import { useState, useEffect } from "react";
import AddBudgetModal from "../components/AddBudgetModal.jsx";
import { useBudgets } from "../context/BudgetContext.jsx";
import { useCategories } from "../context/CategoryContext.jsx";
import { useExpenses } from "../context/ExpenseContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import toast from "react-hot-toast";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Budgets = () => {
  const { activeBudget, addBudget, editBudget, fetchBudgetByMonth } = useBudgets();
  const { categories } = useCategories();
  const { fetchAllExpenses } = useExpenses();
  const { setOnButtonClick } = useUI();

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLimit, setEditLimit] = useState(0);
  const [spent, setSpent] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  useEffect(() => {
    setOnButtonClick(() => () => setShowModal(true));
    return () => setOnButtonClick(null);
  }, [setOnButtonClick]);

  useEffect(() => {
    fetchBudgetByMonth(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Load monthly stats based on active month
  useEffect(() => {
    const loadMonthlyStats = async () => {
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
      const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59).toISOString();

      try {
        const monthlyExpenses = await fetchAllExpenses({ startDate, endDate });
        const total = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
        setSpent(total);

        const breakdown = categories.map((cat) => {
          const catExpenses = monthlyExpenses.filter((e) => {
            const catId = typeof e.categoryId === "object" ? e.categoryId?._id : e.categoryId;
            return catId === cat._id;
          });
          const catSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
          return {
            ...cat,
            spent: catSpent,
          };
        }).filter(c => c.spent > 0);

        setCategoryBreakdown(breakdown);
      } catch (err) {
        console.error("Failed to load monthly expenses stats:", err);
      }
    };

    if (categories.length > 0) {
      loadMonthlyStats();
    }
  }, [activeBudget, categories, selectedMonth, selectedYear]);

  const budgetLimit = activeBudget ? activeBudget.monthlyLimit : 0;
  const remaining = budgetLimit - spent;
  const pct = budgetLimit > 0 ? Math.min(100, Math.round((spent / budgetLimit) * 100)) : 0;
  const over = spent > budgetLimit;

  const handleSaveEdit = async () => {
    try {
      if (activeBudget) {
        await editBudget(activeBudget._id, { monthlyLimit: Number(editLimit) });
        toast.success("Budget limit updated successfully");
      } else {
        // If there's no budget yet, create one
        await addBudget({
          monthlyLimit: Number(editLimit),
          month: selectedMonth,
          year: selectedYear,
        });
        toast.success("Budget set successfully");
      }
      setEditing(false);
    } catch (err) {
      toast.error(err.message || "Failed to update budget limit");
    }
  };

  const handleAddBudgetSubmit = async (data) => {
    try {
      await addBudget(data);
      setSelectedMonth(data.month);
      setSelectedYear(data.year);
      toast.success("Budget set successfully");
    } catch (err) {
      toast.error(err.message || "Failed to set budget");
    }
  };

  const yearsRange = [now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1];

  return (
    <div className="p-4 sm:p-6 space-y-5">
      {/* Date Selectors */}
      <div className="flex gap-2 max-w-xs bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none p-1.5 cursor-pointer"
        >
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none p-1.5 cursor-pointer"
        >
          {yearsRange.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly Budget Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-base font-bold text-gray-900">Monthly Budget</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </p>
          </div>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                className="w-28 h-8 border border-gray-200 rounded-lg px-2 text-sm outline-none focus:border-indigo-400"
              />
              <button
                onClick={handleSaveEdit}
                className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditing(true);
                setEditLimit(budgetLimit);
              }}
              className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {activeBudget ? "Edit" : "Set Budget Limit"}
            </button>
          )}
        </div>

        <p className="text-4xl font-bold text-gray-900 mt-4 mb-5">
          $
          {budgetLimit.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-lg font-bold text-red-500">
              $
              {spent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p
              className="text-lg font-bold"
              style={{ color: over || budgetLimit === 0 ? "#dc2626" : "#059669" }}
            >
              {over ? "-" : ""}$
              {Math.abs(remaining).toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Budget Limit</p>
            <p className="text-lg font-bold text-indigo-500">
              $
              {budgetLimit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Progress */}
        {budgetLimit > 0 ? (
          <>
            <p className="text-xs text-gray-500 mb-2">{pct}% of budget used</p>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${pct}%`,
                  background: over ? "#dc2626" : pct > 80 ? "#d97706" : "#059669",
                }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg p-3 text-center">
            No budget set for this month yet. Use the header button or the edit button to create one.
          </p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <p className="text-base font-bold text-gray-900 mb-5">
          Category Breakdown
        </p>
        {categoryBreakdown.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No spending recorded for this month
          </p>
        ) : (
          <div className="space-y-4">
            {categoryBreakdown.map((cat) => {
              const catPct =
                spent > 0
                  ? Math.round((cat.spent / spent) * 1000) / 10
                  : 0;
              const barPct =
                budgetLimit > 0
                  ? Math.min(100, (cat.spent / budgetLimit) * 100)
                  : spent > 0
                  ? Math.min(100, (cat.spent / spent) * 100)
                  : 0;
              return (
                <div
                  key={cat._id}
                  className="flex flex-col sm:grid sm:items-center gap-2 sm:gap-4 border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  style={{ gridTemplateColumns: "1fr 80px 48px 1fr" }}
                >
                  <div className="flex items-center justify-between sm:contents">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">{cat.emoji}</span>
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 sm:contents">
                      <span className="text-sm font-semibold text-gray-900 text-right sm:col-start-2">
                        $
                        {cat.spent.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-xs text-gray-400 text-right sm:col-start-3">
                        {catPct}%
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full sm:col-start-4">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${barPct}%`, background: cat.color || "#059669" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AddBudgetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddBudgetSubmit}
      />
    </div>
  );
};

export default Budgets;
