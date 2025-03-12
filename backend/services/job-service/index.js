import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/connection.js";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import jobRouter from "./Apis/JobRouter.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/job", jobRouter);
connectDB();
app.use(errorMiddleware);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`job Server running on port ${PORT}`);
});
connectDB();
