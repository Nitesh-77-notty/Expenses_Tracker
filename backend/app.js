import dotenv from "dotenv";
dotenv.config({
  path: "./.env.local",
});

import authRoutes from "./routes/auth.route.js";
import expenseRoutes from "./routes/expense.route.js";
import categoryRoutes from "./routes/category.route.js";
import budgetRoutes from "./routes/budget.route.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
// add cors for frontend

console.log("CORS enabled for frontend URL:", process.env.FRONTEND_URL);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// Routess
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);

app.use(errorMiddleware);

export default app;
