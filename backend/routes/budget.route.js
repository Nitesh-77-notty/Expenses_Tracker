import express from "express";
import {
  createBudget,
  getBudgets,
  getBudgetById,
  getBudgetByMonth,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import auth from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.use(auth);

router
  .route("/")
  .get(asyncHandler(getBudgets))
  .post(asyncHandler(createBudget));

// Must be before /:id
router.get("/month", asyncHandler(getBudgetByMonth));

router
  .route("/:id")
  .get(asyncHandler(getBudgetById))
  .put(asyncHandler(updateBudget))
  .delete(asyncHandler(deleteBudget));

export default router;
