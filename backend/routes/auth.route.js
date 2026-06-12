import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/register", asyncHandler(register));
Router.get("/verify-email/:token", asyncHandler(verifyEmail));
Router.post("/login", asyncHandler(login));
Router.post("/logout", asyncHandler(logout));
Router.post("/forgot-password", asyncHandler(forgotPassword));
Router.post("/reset-password/:token", asyncHandler(resetPassword));


export default Router;
