import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import {
  register,
  verifyEmail,
  login,
} from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/register", asyncHandler(register));
Router.get("/verify-email/:token", asyncHandler(verifyEmail));
Router.post("/login", asyncHandler(login));
export default Router;
