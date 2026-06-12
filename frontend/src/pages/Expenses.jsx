import { useState } from "react";
import AddExpenseModal from "../components/AddExpenseModal";

const mockExpenses = [
  {
    _id: "1",
    description: "Whole Foods Market",
    note: "Weekly groceries",
    category: { name: "Food & dining", emoji: "🍔", color: "#f97316" },
    date: "2025-06-13",
    amount: 68,
  },
  {
    _id: "2",
    description: "Uber",
    note: "Airport ride",
    category: { name: "Transport", emoji: "🚗", color: "#2563eb" },
    date: "2025-06-12",
    amount: 14,
  },
  {
    _id: "3",
    description: "Netflix",
    note: "Monthly sub",
    category: { name: "Entertainment", emoji: "🎮", color: "#d97706" },
    date: "2025-06-12",
    amount: 18,
  },
  {
    _id: "4",
    description: "CVS Pharmacy",
    note: "Medicine",
    category: { name: "Health", emoji: "💊", color: "#059669" },
    date: "2025-06-11",
    amount: 43,
  },
  {
    _id: "5",
    description: "Amazon",
    note: "Desk accessories",
    category: { name: "Shopping", emoji: "🛍️", color: "#7c3aed" },
    date: "2025-06-10",
    amount: 127,
  },
  {
    _id: "6",
    description: "Electricity bill",
    note: "June payment",
    category: { name: "Utilities", emoji: "⚡", color: "#6366f1" },
    date: "2025-06-09",
    amount: 89,
  },
  {
    _id: "7",
    description: "Starbucks",
    note: "",
    category: { name: "Food & dining", emoji: "🍔", color: "#f97316" },
    date: "2025-06-08",
    amount: 7,
  },
  {
    _id: "8",
    description: "Gym membership",
    note: "Monthly",
    category: { name: "Health", emoji: "💊", color: "#059669" },
    date: "2025-06-07",
    amount: 45,
  },
];

const categories = [
  "All categories",
  "Food & dining",
  "Transport",
  "Shopping",
  "Health",
  "Entertainment",
  "Utilities",
];

const Expenses = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    categoryId: "",
    note: "",
  });

  const filtered = mockExpenses.filter((e) => {
    const matchSearch = e.description
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchCat =
      category === "All categories" || e.category.name === category;
    return matchSearch && matchCat;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: POST /api/expenses
    setShowModal(false);
    setForm({
      description: "",
      amount: "",
      date: "",
      categoryId: "",
      note: "",
    });
  };

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Track and manage all your expense logs
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors"
        >
          + Add expense
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-9 flex-1 max-w-xs">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-900 outline-none w-full placeholder-gray-400"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-3 h-9 text-sm text-gray-700 outline-none cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "fixed" }}
        >
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {["Description", "Category", "Date", "Note", "Amount", ""].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-medium text-gray-500 uppercase tracking-wide px-4 py-2.5"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center text-sm text-gray-400 py-10"
                >
                  No expenses found
                </td>
              </tr>
            ) : (
              filtered.map((expense) => (
                <tr
                  key={expense._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: expense.category.color + "18" }}
                      >
                        {expense.category.emoji}
                      </div>
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {expense.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        background: expense.category.color + "18",
                        color: expense.category.color,
                      }}
                    >
                      {expense.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 truncate">
                    {expense.note || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                    ${expense.amount}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded-md text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 16H7v-2a2 2 0 01.586-1.414z"
                          />
                        </svg>
                      </button>
                      <button className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Expenses;
