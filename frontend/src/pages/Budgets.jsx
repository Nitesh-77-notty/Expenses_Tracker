import { useState } from "react";
import AddBudgetModal from "../components/AddBudgetModal.jsx";
import Header from "../components/Header.jsx";

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

const mockBudget = {
  _id: "1",
  month: 6,
  year: 2025,
  monthlyLimit: 4000,
  spent: 2840,
};

const mockCategories = [
  { _id: "1", name: "Food", emoji: "🍔", spent: 820 },
  { _id: "2", name: "Transport", emoji: "🚗", spent: 430 },
  { _id: "3", name: "Shopping", emoji: "🛍️", spent: 610 },
  { _id: "4", name: "Health", emoji: "💊", spent: 340 },
  { _id: "5", name: "Entertainment", emoji: "🎮", spent: 250 },
  { _id: "6", name: "Utilities", emoji: "⚡", spent: 390 },
];

const Budgets = () => {
  const [budget, setBudget] = useState(mockBudget);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editLimit, setEditLimit] = useState(budget.monthlyLimit);

  const remaining = budget.monthlyLimit - budget.spent;
  const pct = Math.min(
    100,
    Math.round((budget.spent / budget.monthlyLimit) * 100),
  );
  const over = budget.spent > budget.monthlyLimit;

  const handleSaveEdit = () => {
    setBudget((prev) => ({ ...prev, monthlyLimit: Number(editLimit) }));
    setEditing(false);
  };

  return (
    <div className="p-6 space-y-5">
      <Header onButtonClick={() => setShowModal(true)} />
      {/* Monthly Budget Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-base font-bold text-gray-900">Monthly Budget</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {MONTHS[budget.month - 1]} {budget.year}
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
                className="text-xs font-medium text-white bg-indigo-500 hover:bg-indigo-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditing(true);
                setEditLimit(budget.monthlyLimit);
              }}
              className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        <p className="text-4xl font-bold text-gray-900 mt-4 mb-5">
          $
          {budget.monthlyLimit.toLocaleString("en-US", {
            minimumFractionDigits: 2,
          })}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Total Spent</p>
            <p className="text-lg font-bold text-red-500">
              $
              {budget.spent.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Remaining</p>
            <p
              className="text-lg font-bold"
              style={{ color: over ? "#dc2626" : "#059669" }}
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
              {budget.monthlyLimit.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* Progress */}
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
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <p className="text-base font-bold text-gray-900 mb-5">
          Category Breakdown
        </p>
        <div className="space-y-4">
          {mockCategories.map((cat) => {
            const catPct =
              budget.spent > 0
                ? Math.round((cat.spent / budget.spent) * 1000) / 10
                : 0;
            const barPct =
              budget.monthlyLimit > 0
                ? Math.min(100, (cat.spent / budget.monthlyLimit) * 100)
                : 0;
            return (
              <div
                key={cat._id}
                className="grid items-center gap-4"
                style={{ gridTemplateColumns: "1fr 80px 48px 1fr" }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-sm font-medium text-gray-800">
                    {cat.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900 text-right">
                  $
                  {cat.spent.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs text-gray-400 text-right">
                  {catPct}%
                </span>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${barPct}%`, background: "#059669" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddBudgetModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => setBudget((prev) => ({ ...prev, ...data }))}
      />
    </div>
  );
};

export default Budgets;
