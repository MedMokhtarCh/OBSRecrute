import express from "express";
import {
  getUserNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/notifications/:userId", getUserNotifications);
router.put("/notifications/:id/read", markAsRead);

export default router;
