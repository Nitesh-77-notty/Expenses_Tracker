import authRoutes from "./routes/auth.route.js";
import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);


app.use(errorMiddleware);


export default app;