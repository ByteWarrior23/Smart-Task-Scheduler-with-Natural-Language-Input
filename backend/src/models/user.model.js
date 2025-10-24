import mongoose, { Schema } from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      maxLength: 16,
      unique: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      maxLength: 50,
      trim: true,
    },
    password: {
      type: String,
      // Password is required only for local auth
      required: function () {
        return this.authProvider === 'local';
      },
      trim: true,
      minLength: 8,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    profile_picture: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // OAuth provider fields
    authProvider: {
      type: String,
      enum: ['local', 'github'],
      default: 'local',
      index: true,
    },
    providerId: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    // Support multiple devices by storing multiple refresh tokens
    refreshTokens: {
      type: [String],
      default: [],
    },
    emailConfig: {
      service: {
        type: String,
        default: 'gmail',
      },
      user: {
        type: String,
        default: null,
      },
      pass: {
        type: String,
        default: null,
      },
      host: {
        type: String,
        default: null,
      },
      port: {
        type: Number,
        default: null,
      },
      secure: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ providerId: 1 });
UserSchema.index({ refreshTokens: 1 });

// Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export const User = mongoose.model('User', UserSchema);

