import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import auth from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(auth);

router
  .route("/")
  .get(asyncHandler(getExpenses))
  .post(asyncHandler(createExpense));

router
  .route("/:id")
  .get(asyncHandler(getExpenseById))
  .put(asyncHandler(updateExpense))
  .delete(asyncHandler(deleteExpense));

export default router;
