import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../database/models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Access denied: Admins only", 403));
  }
  next();
};
