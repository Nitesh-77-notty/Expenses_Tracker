import User from "../models/User.js";
import crypto from "crypto";
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // create new user
  const newUser = new User({ username, email, password });

  // Generate email verification token and save user
  const verificationToken = crypto.randomBytes(20).toString("hex");
  newUser.emailVerificationToken = verificationToken;
  await newUser.save();

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  // Find user by verification token
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Mark email as verified and clear the token
  user.isVerified = true;
  user.emailVerificationToken = undefined;

  //save the user
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data: user,
  });
};
