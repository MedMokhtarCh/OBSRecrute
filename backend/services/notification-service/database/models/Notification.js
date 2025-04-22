import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId, // Assure une relation avec un utilisateur
    required: true,
    ref: "User",
  },
  message: {
    type: String,
    required: true,
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application", // Tu peux lier à ta collection d'applications
  },
  type: {
    type: String,
    enum: ["statusChange", "custom", "system"],
    default: "statusChange",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
