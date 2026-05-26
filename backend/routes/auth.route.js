import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { register } from "../controllers/auth.controller.js";
const Router = express.Router();

Router.post("/register", asyncHandler(register));

export default Router;
