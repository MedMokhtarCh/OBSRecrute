import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  updatePassword,
  deleteUser,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../Middlewares/authen.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/Profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.delete("/deleteUser/:id", isAuthenticated, isAdmin, deleteUser);
export default router;
