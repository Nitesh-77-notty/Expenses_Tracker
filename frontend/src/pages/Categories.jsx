import { useState, useEffect } from "react";
import AddCategoryModal from "../components/AddCategoryModal.jsx";
import { useCategories } from "../context/CategoryContext.jsx";
import { useExpenses } from "../context/ExpenseContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import toast from "react-hot-toast";

const Categories = () => {
  const { categories, addCategory, deleteCategory } = useCategories();
  const { fetchAllExpenses } = useExpenses();
  const { setOnButtonClick } = useUI();
  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOnButtonClick(() => () => setShowModal(true));
    return () => setOnButtonClick(null);
  }, [setOnButtonClick]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchAllExpenses();
        setExpenses(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadExpenses();
  }, [categories]);

  // Compute category stats
  const categoriesWithStats = categories.map((c) => {
    const catExpenses = expenses.filter((e) => {
      const catId = typeof e.categoryId === "object" ? e.categoryId?._id : e.categoryId;
      return catId === c._id;
    });
    const totalSpent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    return {
      ...c,
      expenseCount: catExpenses.length,
      totalSpent,
    };
  });

  const filtered = categoriesWithStats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (newCategory) => {
    try {
      await addCategory(newCategory);
      toast.success("Category added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
      } catch (err) {
        toast.error(err.message || "Failed to delete category");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Search Filter */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 h-9 flex-1 max-w-md shadow-sm">
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
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-900 outline-none w-full placeholder-gray-400"
          />
        </div>
      </div>

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
                {!cat.isDefault && (
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
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
