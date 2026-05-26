import User from "../models/User.js";

export const register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newUser = new User({ username, email, password });
  newUser.save();
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
};
