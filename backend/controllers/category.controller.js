import Category from "../models/Category.js";
import mongoose from "mongoose";

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  const { name, emoji, color, isDefault } = req.body;

  const exists = await Category.findOne({
    name: req.body.name,
    userId: req.user._id,
  });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Category with this name already exists",
    });
  }

  const category = await Category.create({
    userId: req.user._id,
    name,
    emoji,
    color,
    isDefault,
  });

  res.status(201).json({ success: true, data: category });
};

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  const { isDefault } = req.query;

  const filter = { userId: req.user._id };
  if (isDefault !== undefined) filter.isDefault = isDefault === "true";

  const categories = await Category.find(filter).sort({ createdAt: -1 });

  res
    .status(200)
    .json({ success: true, total: categories.length, data: categories });
};

// @desc    Get a single category by ID
// @route   GET /api/categories/:id
// @access  Private
export const getCategoryById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID" });
  }

  const category = await Category.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  res.status(200).json({ success: true, data: category });
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID" });
  }

  const { name, emoji, color, isDefault } = req.body;

  // prevent duplicate name on update
  if (name) {
    const duplicate = await Category.findOne({
      name,
      userId: req.user._id,
      _id: { $ne: req.params.id },
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }
  }

  const category = await Category.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { name, emoji, color, isDefault },
    { new: true, runValidators: true },
  );

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  res.status(200).json({ success: true, data: category });
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category ID" });
  }

  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "Category deleted successfully" });
};
