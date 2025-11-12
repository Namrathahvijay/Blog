import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// Get user notifications
router.get("/", auth, getNotifications);

// Mark notification as read
router.put("/:id/read", auth, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", auth, markAllAsRead);

// Delete notification
router.delete("/:id", auth, deleteNotification);

export default router;
