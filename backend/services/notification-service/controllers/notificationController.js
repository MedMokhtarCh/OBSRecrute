import { Notification } from "../database/models/Notification.js";

// GET /notifications/:userId
export const getUserNotifications = async (req, res) => {
  const { userId } = req.params;
  const notifications = await Notification.find({ userId }).sort({
    createdAt: -1,
  });
  res.status(200).json({ success: true, notifications });
};

// PUT /notifications/:id/read
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  const notif = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
  res.status(200).json({ success: true, notification: notif });
};
