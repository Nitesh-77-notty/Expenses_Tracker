import User from "../models/User.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hasedPassword = await bcrypt.hash(password, 10);

  // create new user
  const newUser = new User({ username, email, password: hasedPassword });

  // Generate email verification token and save user
  const verificationToken = crypto.randomBytes(20).toString("hex");
  newUser.emailVerificationToken = verificationToken;

  // Send verification email
  sendEmail({
    to: email,
    subject: "Verify your email",
    html: `<p>Click the link below to verify your email:</p><a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">Verify Email</a>`,
  });
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

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Check if email is verified
  if (!user.isVerified) {
    return res.status(400).json({ message: "Email not verified" });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Prepare user data for response (excluding sensitive info)
  const userData = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: userData,
  });
};
