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

const router = express.Router();

router.use(auth);

router.route("/").get(getBudgets).post(createBudget);
router.get("/month", getBudgetByMonth);          // ← must be before /:id
router.route("/:id").get(getBudgetById).put(updateBudget).delete(deleteBudget);

export default router;