import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

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

  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] });
  if (existingUser) throw new ApiError(400, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: normalizedUsername,
    email: normalizedEmail,
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

  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim().toLowerCase();

  const user = await User.findOne({ $or: [{ username: normalizedUsername }, { email: normalizedEmail }] });
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

const updateDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { username, email, fullname, profile_picture } = req.body;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Normalize incoming values
    const nextUsername = typeof username === 'string' ? username.trim() : undefined;
    const nextEmail = typeof email === 'string' ? email.trim().toLowerCase() : undefined;

    // Enforce uniqueness for username if changing
    if (nextUsername && nextUsername !== user.username) {
        const taken = await User.findOne({ username: nextUsername });
        if (taken) throw new ApiError(409, "Username already taken");
        user.username = nextUsername;
    }

    // Enforce uniqueness for email if changing
    if (nextEmail && nextEmail !== user.email) {
        const taken = await User.findOne({ email: nextEmail });
        if (taken) throw new ApiError(409, "Email already in use");
        user.email = nextEmail;
    }

    if (typeof fullname === 'string' && fullname.trim()) {
        user.fullname = fullname;
    }
    if (typeof profile_picture === 'string' && profile_picture.trim()) {
        user.profile_picture = profile_picture;
    }

    await user.save();
    return res.status(200).json(new ApiResponse(200, "User details updated successfully", {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        profile_picture: user.profile_picture
    }));    
});

const refreshSession = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401, "Refresh token is missing")
    }
    
    try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_TOKEN);
        const user = await User.findById(decoded._id)
        if(!user || user.refreshToken !== incomingRefreshToken){
            throw new ApiError(401, "Invalid refresh token")
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessTokenandRefreshToken(user.id)

        const options = {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
        }
        
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
            200,
            "Token refreshed successfully",
            {
                accessToken,
                refreshToken: newRefreshToken
            }
            )
        )
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Invalid or expired refresh token")
        }
        throw error;
    }
});

const getMe = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) throw new ApiError(404, "User not found");

    return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});

const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Both current and new passwords are required");
    }
    const user = await User.findById(userId);   
    if (!user) throw new ApiError(404, "User not found");
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) throw new ApiError(400, "Current password is incorrect");
    user.password = await bcrypt.hash(newPassword, 10);
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    await user.deleteOne();
    return res.status(200).json(new ApiResponse(200, "User deleted successfully"));
});

const updateEmailConfig = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { emailConfig } = req.body;

    if (!emailConfig) {
        throw new ApiError(400, "Email configuration is required");
    }

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Update email configuration
    user.emailConfig = {
        service: emailConfig.service || 'gmail',
        user: emailConfig.user || null,
        pass: emailConfig.pass || null,
        host: emailConfig.host || null,
        port: emailConfig.port || null,
        secure: emailConfig.secure || false
    };

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Email configuration updated successfully", {
        emailConfig: user.emailConfig
    }));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) throw new ApiError(404, "User not found");

    // Generate reset token (simple implementation - in production use JWT with expiration)
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_RESET_TOKEN, { expiresIn: '15m' });

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Use user's email config or default
    const emailConfig = user.emailConfig?.user ? user.emailConfig : {};
    const result = await sendReminderEmail(email, { title: 'Password Reset', description: 'Reset your password', resetLink }, 'reset', emailConfig);

    if (!result.success) {
        throw new ApiError(500, "Failed to send reset email");
    }

    return res.status(200).json(new ApiResponse(200, "Password reset link sent to your email"));
});


export {registerUser,
    loginUser,
    logoutUser,
    updateDetails,
    refreshSession,
    getMe,
    changePassword,
    deleteUser,
    updateEmailConfig,
    forgotPassword
};
