import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { register, verifyEmail } from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/register", asyncHandler(register));
Router.get("/verify-email/:token", asyncHandler(verifyEmail));
export default Router;
