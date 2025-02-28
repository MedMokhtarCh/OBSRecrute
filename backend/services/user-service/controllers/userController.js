import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import ErrorHandler from "../Middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { User } from "../database/models/UserSchema.js";
import dotenv from "dotenv";
dotenv.config();
export const register = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      password,
      role,
      firstChoice,
      SecondChoice,
      ThirdChoice,
      companyName,
    } = req.body;
    if (!name || !email || !phone || !address || !password || !role) {
      return next(new ErrorHandler("All fields are required", 400));
    }
    if (
      role === "Job Seeker" &&
      (!firstChoice || !SecondChoice || !ThirdChoice)
    ) {
      return next(
        new ErrorHandler("Please provide your preffereed job fields", 400)
      );
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
    if (role === "Job Seeker") {
      UserData.fieldChoices = { firstChoice, SecondChoice, ThirdChoice };
    }

    if (role === "Employer") {
      UserData.companyName = companyName;
    }

    // Création de l'utilisateur
    const user = await User.create(UserData);

    // Envoi du token et réponse
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
      // Réécrit le cookie "token" avec une valeur vide
      expires: new Date(Date.now()), //Expire immédiatemen
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
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

  const newUserData = {
    name: req.body.name || user.name,
    email: req.body.email || user.email,
    phone: req.body.phone || user.phone,
    address: req.body.address || user.address,
    fieldChoices: {
      firstChoice: req.body.firstChoice ?? user.fieldChoices?.firstChoice,
      SecondChoice: req.body.SecondChoice ?? user.fieldChoices?.SecondChoice,
      ThirdChoice: req.body.ThirdChoice ?? user.fieldChoices?.ThirdChoice,
    },
  };

  const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user: updatedUser,
    message: "Profile updated.",
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
