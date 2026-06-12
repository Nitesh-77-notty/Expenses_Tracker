import { useState } from "react";
import AddCategoryModal from "../components/AddCategoryModal.jsx";
import Header from "../components/Header.jsx";

const mockCategories = [
  {
    _id: "1",
    name: "Food & dining",
    emoji: "🍔",
    color: "#f97316",
    isDefault: true,
    expenseCount: 12,
    totalSpent: 820,
  },
  {
    _id: "2",
    name: "Transport",
    emoji: "🚗",
    color: "#2563eb",
    isDefault: true,
    expenseCount: 8,
    totalSpent: 430,
  },
  {
    _id: "3",
    name: "Shopping",
    emoji: "🛍️",
    color: "#7c3aed",
    isDefault: false,
    expenseCount: 5,
    totalSpent: 610,
  },
  {
    _id: "4",
    name: "Health",
    emoji: "💊",
    color: "#059669",
    isDefault: true,
    expenseCount: 4,
    totalSpent: 340,
  },
  {
    _id: "5",
    name: "Entertainment",
    emoji: "🎮",
    color: "#d97706",
    isDefault: false,
    expenseCount: 3,
    totalSpent: 250,
  },
  {
    _id: "6",
    name: "Utilities",
    emoji: "⚡",
    color: "#6366f1",
    isDefault: true,
    expenseCount: 2,
    totalSpent: 390,
  },
];

const Categories = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAdd = (newCategory) => {
    setCategories((prev) => [
      ...prev,
      {
        ...newCategory,
        _id: Date.now().toString(),
        expenseCount: 0,
        totalSpent: 0,
      },
    ]);
  };

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <Header onButtonClick={() => setShowModal(true)} />

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center text-sm text-gray-400 py-16">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex items-start justify-between hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: cat.color + "18" }}
                >
                  {cat.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {cat.name}
                    </p>
                    {cat.isDefault && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500">
                        default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {cat.expenseCount} expenses · ${cat.totalSpent}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors">
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
                {!cat.isDefault && (
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
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
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAdd}
      />
    </div>
  );
};

export default Categories;
