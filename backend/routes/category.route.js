import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import auth from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(auth);

router
  .route("/")
  .get(asyncHandler(getCategories))
  .post(asyncHandler(createCategory));

router
  .route("/:id")
  .get(asyncHandler(getCategoryById))
  .put(asyncHandler(updateCategory))
  .delete(asyncHandler(deleteCategory));

export default router;
