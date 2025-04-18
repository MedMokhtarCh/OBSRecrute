import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";
import { errorMiddleware } from "./Middlewares/error.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import userRouter from "./Apis/UserRoutes.js";
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Middleware pour gérer les fichiers uploadés
app.use(
  fileUpload({
    useTempFiles: true, // Utiliser les fichiers temporaires
    tempFileDir: "/tmp/", // Dossier temporaire pour les fichiers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/v1/user", userRouter);

connectDB();
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
