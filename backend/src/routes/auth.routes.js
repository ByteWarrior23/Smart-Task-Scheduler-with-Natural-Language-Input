import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  getMe,
  changePassword,
  updateDetails,
  deleteUser,
  updateEmailConfig
} from "../controllers/user.controller.js";

const router = Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshSession);

// Protected
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getMe);
router.patch("/change-password", verifyJWT, changePassword);
router.patch("/update", verifyJWT, updateDetails);
router.patch("/email-config", verifyJWT, updateEmailConfig);
router.delete("/delete", verifyJWT, deleteUser);

export default router;


