import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller.js";
import auth from "../middleware/auth.middleware.js";
const Router = express.Router();

Router.post("/register", asyncHandler(register));
Router.get("/verify-email/:token", asyncHandler(verifyEmail));
Router.post("/login", asyncHandler(login));
Router.post("/logout", asyncHandler(logout));
Router.post("/forgot-password", asyncHandler(forgotPassword));
Router.post("/reset-password/:token", asyncHandler(resetPassword));
Router.get("/me", auth, asyncHandler(getMe));

export default Router;
