import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useCategories } from "../context/CategoryContext.jsx";

const AddExpenseModal = ({ isOpen, onClose, onSubmit, editingExpense }) => {
  const { categories } = useCategories();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    categoryId: "",
    note: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setForm({
        description: editingExpense.description || "",
        amount: editingExpense.amount || "",
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().split("T")[0] : "",
        categoryId: typeof editingExpense.categoryId === "object" ? editingExpense.categoryId?._id : editingExpense.categoryId || "",
        note: editingExpense.note || "",
      });
    } else {
      setForm({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        categoryId: "",
        note: "",
      });
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
    setForm({
      description: "",
      amount: "",
      date: "",
      categoryId: "",
      note: "",
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingExpense ? "Edit expense" : "Add expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              required
              step="0.01"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            type="text"
            placeholder="What did you spend on?"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer"
            required
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.emoji} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Note <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="Any extra details..."
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
          />
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            {editingExpense ? "Update expense" : "Save expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddExpenseModal;
