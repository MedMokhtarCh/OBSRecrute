import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/Connection.js";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import { errorMiddleware } from "./Middlewares/error.js";
import ApplicationRoutes from "./Apis/ApplicationRoutes.js";

dotenv.config();

// Configurer Cloudinary
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

// Middleware pour parser les cookies
app.use(cookieParser());

// Middleware CORS
app.use(
  cors({
    origin: [process.env.FRONTEND_URL], // Autoriser l'URL du frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware pour parser le JSON du body
app.use(express.json());

// Routes pour les applications
app.use("/api/v1/Application", ApplicationRoutes);

// Connexion à la base de données
connectDB();

// Middleware d'erreurs - doit être dernier
app.use(errorMiddleware);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Application Server running on port ${PORT}`);
});
