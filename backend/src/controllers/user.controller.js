import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Generate access + refresh tokens
const generateAccessTokenandRefreshToken = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;

  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  if (!username || !email || !fullname || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) throw new ApiError(400, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    fullname,
    password: hashedPassword,
  });

  const safeUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
  };

  return res.status(201).json(new ApiResponse(201, "User created successfully", safeUser));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (!user) throw new ApiError(400, "User not found");

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

  const safeUser = {
    id: user._id,
    username: user.username,
    email: user.email,
    fullname: user.fullname,
  };

  return res.status(200).json(new ApiResponse(200, "User logged in successfully", { safeUser, accessToken, refreshToken }));
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  // Assuming you extract userId from JWT middleware
  const userId = req.user.id;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Clear refresh token
  user.refreshToken = null;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "User logged out successfully", {
    id: user._id,
    username: user.username,
    email: user.email
  }));
});

export { registerUser, loginUser, logoutUser };