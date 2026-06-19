import express from "express";
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expense.controller.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(auth); // apply auth to all expense routes

router.route("/").get(getExpenses).post(createExpense);

router.route("/:id").get(getExpenseById).put(updateExpense).delete(deleteExpense);

export default router;