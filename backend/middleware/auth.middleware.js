import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next(new AppError("Not authorized", 401));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return next(new AppError("User no longer exists", 401));

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError("Invalid token", 401));
  }
};


export default auth;