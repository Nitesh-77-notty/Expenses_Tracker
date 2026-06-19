import Budget from "../models/Budget.js";
import mongoose from "mongoose";

// @desc    Create a new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { monthlyLimit, month, year } = req.body;

    // prevent duplicate budget for same month/year per user
    const exists = await Budget.findOne({ userId: req.user._id, month, year });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: `Budget for ${month}/${year} already exists`,
      });
    }

    const budget = await Budget.create({
      userId: req.user._id,
      monthlyLimit,
      month,
      year,
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all budgets for the logged-in user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const { year } = req.query;

    const filter = { userId: req.user._id };
    if (year) filter.year = Number(year);

    const budgets = await Budget.find(filter).sort({ year: -1, month: -1 });

    res.status(200).json({ success: true, total: budgets.length, data: budgets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single budget by ID
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid budget ID" });
    }

    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get budget by month and year
// @route   GET /api/budgets/month?month=6&year=2026
// @access  Private
export const getBudgetByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "month and year are required" });
    }

    const budget = await Budget.findOne({
      userId: req.user._id,
      month: Number(month),
      year: Number(year),
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: `No budget found for ${month}/${year}` });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid budget ID" });
    }

    const { monthlyLimit, month, year } = req.body;

    // prevent duplicate month/year on update
    if (month || year) {
      const duplicate = await Budget.findOne({
        userId: req.user._id,
        month: month,
        year: year,
        _id: { $ne: req.params.id },
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Budget for ${month}/${year} already exists`,
        });
      }
    }

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { monthlyLimit, month, year },
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid budget ID" });
    }

    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};