import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import ErrorHandler from "../Middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { User } from "../database/models/UserSchema.js";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import axios from "axios";
dotenv.config();

export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
      role,
      companyName,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return next(
        new ErrorHandler("All required fields must be provided", 400)
      );
    }

    if (password !== confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    if (role === "Employer" && (!companyName || companyName.trim() === "")) {
      return next(
        new ErrorHandler("Company name is required for Employers", 400)
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("Email is already registered.", 400));
    }

    const UserData = {
      name,
      email,
      phone,
      address,
      password,
      role,
    };

    if (role === "Employer") {
      UserData.companyName = companyName;
    }

    const user = await User.create(UserData);
    sendToken(user, 201, res, "User created successfully");
  } catch (error) {
    next(error);
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password  are required", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password ", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  sendToken(user, 200, res, "user logged in successfully");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

export const addFavoriteJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.body;

  if (!jobId) {
    return next(new ErrorHandler("Job ID is required", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.favorites.includes(jobId)) {
    return next(new ErrorHandler("Job is already in your favorites", 400));
  }

  user.favorites.push(jobId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Job added to favorites",
    favorites: user.favorites,
  });
});

export const removeFavoriteJob = catchAsyncErrors(async (req, res, next) => {
  const { jobId } = req.body;

  if (!jobId) {
    return next(new ErrorHandler("Job ID is required", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const jobIndex = user.favorites.indexOf(jobId);
  if (jobIndex === -1) {
    return next(new ErrorHandler("Job not found in favorites", 400));
  }

  user.favorites.splice(jobIndex, 1);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Job removed from favorites",
    favorites: user.favorites,
  });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const data = { ...req.body };

  const requiredFields = ["name", "email", "phone", "address", "role"];
  for (const field of requiredFields) {
    if (!data[field]) {
      return next(new ErrorHandler(`Le champ "${field}" est requis.`, 400));
    }
  }

  if (req.files?.profilePicture) {
    const result = await cloudinary.uploader.upload(
      req.files.profilePicture.tempFilePath,
      {
        folder: "profiles",
        width: 300,
        crop: "scale",
      }
    );
    data.profilePicture = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const jsonFields = [
    "diplomas",
    "technicalSkills",
    "softSkills",
    "languages",
    "education",
    "experiences",
    "fieldChoices",
    "companyProfile",
  ];

  jsonFields.forEach((field) => {
    if (data[field] && typeof data[field] === "string") {
      try {
        // Handle empty strings and invalid JSON gracefully
        if (data[field] === "") {
          data[field] = []; // Set to empty array if it's an empty string
        } else {
          data[field] = JSON.parse(data[field]);
        }
      } catch (e) {
        console.error(`Erreur parsing champ ${field}:`, e);
        return next(
          new ErrorHandler(
            `Le champ "${field}" contient des données invalides.`,
            400
          )
        );
      }
    }
  });

  if (req.files?.["companyProfile.logo"]) {
    if (!data.companyProfile) {
      data.companyProfile = {};
    }

    const result = await cloudinary.uploader.upload(
      req.files["companyProfile.logo"].tempFilePath,
      {
        folder: "company_logos",
        width: 300,
        crop: "scale",
      }
    );
    data.companyProfile.logo = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: "Profil updated",
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(
      new ErrorHandler("New password & confirm password do not match.", 400)
    );
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res, "Password updated successfully.");
});

export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  await user.deleteOne();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Please enter your email", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Génération OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000; // expire dans 10 min
  await user.save();

  // Envoi Email
  await sendEmail(
    user.email,
    "Réinitialisation de mot de passe",
    `Votre code de réinitialisation est : ${otp}`
  );

  res.status(200).json({
    success: true,
    message: `OTP envoyé à ${user.email}`,
  });
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email, otp, newPassword, confirmPassword } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Tous les champs sont requis", 400));
  }

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("OTP invalide ou expiré", 400));
  }

  if (newPassword !== confirmPassword) {
    return next(
      new ErrorHandler("Les mots de passe ne correspondent pas", 400)
    );
  }

  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;

  await user.save();
  res.status(200).json({ success: true, message: "Mot de passe réinitialisé" });
});
