import express from "express";
import {
  register,
  login,
  logout,
  getUser,
  updateProfile,
  updatePassword,
  deleteUser,
  forgotPassword,
  resetPassword,
  addFavoriteJob,
  removeFavoriteJob,
} from "../controllers/userController.js";
import {
  isAdmin,
  isAuthenticated,
  isAuthorized,
} from "../Middlewares/authen.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getuser", isAuthenticated, getUser);
router.put("/update/Profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.delete("/deleteUser/:id", isAuthenticated, isAdmin, deleteUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post(
  "/add-favorite",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  addFavoriteJob
);

// Supprimer un job des favoris
router.post(
  "/remove-favorite",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  removeFavoriteJob
);

export default router;
