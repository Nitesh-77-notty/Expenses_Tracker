import Expense from "../models/Expense.js";
import mongoose from "mongoose";

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res) => {
  const { categoryId, amount, description, note, date } = req.body;

  const expense = await Expense.create({
    userId: req.user._id, // assumes auth middleware attaches req.user
    categoryId,
    amount,
    description,
    note,
    date,
  });

  res.status(201).json({ success: true, data: expense });
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res) => {
  const { categoryId, startDate, endDate, search, page = 1, limit = 10 } = req.query;

  const filter = { userId: req.user._id };

  if (categoryId) filter.categoryId = categoryId;

  if (search) {
    filter.description = { $regex: search, $options: "i" };
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [expenses, total] = await Promise.all([
    Expense.find(filter)
      .populate("categoryId", "name emoji color")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Expense.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: expenses,
  });
};

// @desc    Get a single expense by ID
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid expense ID" });
  }

  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.user._id,
  }).populate("categoryId", "name emoji color");

  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }

  res.status(200).json({ success: true, data: expense });
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid expense ID" });
  }

  const { categoryId, amount, description, note, date } = req.body;

  const expense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { categoryId, amount, description, note, date },
    { new: true, runValidators: true },
  ).populate("categoryId", "name emoji color");

  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }

  res.status(200).json({ success: true, data: expense });
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid expense ID" });
  }

  const expense = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!expense) {
    return res
      .status(404)
      .json({ success: false, message: "Expense not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Expense deleted successfully" });
};
