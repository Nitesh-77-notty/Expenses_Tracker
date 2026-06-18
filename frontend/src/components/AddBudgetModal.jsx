import { useState } from "react";
import Modal from "./Modal";

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

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

const AddBudgetModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    monthlyLimit: "",
    month: new Date().getMonth() + 1,
    year: currentYear,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      monthlyLimit: Number(form.monthlyLimit),
      month: Number(form.month),
      year: Number(form.year),
    });
    setForm({
      monthlyLimit: "",
      month: new Date().getMonth() + 1,
      year: currentYear,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add budget">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 cursor-pointer"
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Monthly limit
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={form.monthlyLimit}
            onChange={(e) =>
              setForm({ ...form, monthlyLimit: e.target.value })
            }
            className="w-full h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
            required
            min={0}
          />
        </div>
        <div className="flex gap-2 justify-end pt-2">
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
            Save budget
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddBudgetModal;
