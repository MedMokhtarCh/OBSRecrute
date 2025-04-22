import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import connectDB from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import { consumeMessages } from "./rabbit/consume.js";
import { sendNotificationEmail } from "./utils/emailSender.js";
import { Notification } from "./database/models/Notification.js";
import notificationRoutes from "./routes/notificationRoutes.js";
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Error middleware
app.use(errorMiddleware);
app.use("/api", notificationRoutes);
const PORT = process.env.PORT || 5003;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Notification Server running on port ${PORT}`);
    });

    // Start consuming RabbitMQ messages
    await consumeMessages(async (data) => {
      const { recipient, message, applicationId } = data;

      // Save notification to DB
      await Notification.create({ recipient, message, applicationId });

      try {
        // Fetch user data (email, name)
        const userResponse = await axios.get(
          `http://localhost:4001/api/v1/user/getUser/${recipient}`
        );
        const email = userResponse.data.user.email;
        const candidateName = userResponse.data.user.name;

        // Fetch job details from application ID
        const applicationResponse = await axios.get(
          `http://localhost:4002/api/v1/job/applications/job/${applicationId}`
        );

        const jobDetails = applicationResponse.data.job;

        // Fetch application status from application ID
        const application = await axios.get(
          `http://localhost:4003/api/v1/Application/applications/${applicationId}`
        );
        const status = application.data.application.status;

        if (!email || !jobDetails) {
          console.warn("❗ Email or job details missing. Email not sent.");
          return;
        }
        // Send the detailed email
        await sendNotificationEmail({
          to: email,
          subject: "📩 Update on your job application",
          jobDetails,
          candidateName,
          status,
        });
      } catch (err) {
        console.error(
          "❌ Failed to retrieve user/job data or send email:",
          err
        );
        return;
      }
    });

    console.log("📡 Notification Service listening to RabbitMQ");
  } catch (err) {
    console.error("❌ Error starting Notification Service:", err);
  }
};

start();
