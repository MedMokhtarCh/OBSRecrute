import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "Job_DB",
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
export default connectDB;
