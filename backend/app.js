import authRoutes from "./routes/auth.route.js";
import express from "express";
import expenseRoutes from "./routes/expense.route.js";
import categoryRoutes from "./routes/category.route.js";
import budgetRoutes from "./routes/budget.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
// add cors for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use(errorMiddleware);


export default app;