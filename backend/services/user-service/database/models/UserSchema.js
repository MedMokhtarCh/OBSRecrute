import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
import validator from "validator";
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must contain at least 3 characters."],
    maxLength: [30, "Name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please enter a valid email address"],
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  fieldChoices: {
    firstChoice: String,
    SecondChoice: String,
    ThirdChoice: String,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Name must contain at least 8 characters."],
    maxLength: [32, "Name cannot exceed 32 characters"],
    select: false,
  },
  resume: {
    public_id: String,
    url: String,
  },
  coverLetter: {
    type: mongoose.Schema.Types.Mixed, // Allows both string and file objects
    validate: {
      validator: function (value) {
        if (
          typeof value === "string" ||
          (value && value.url && value.public_id)
        ) {
          return true;
        }
        return false;
      },
      message: "Cover letter must be either a string or a valid file object.",
    },
  },

  role: {
    type: String,
    required: true,
    enum: ["Job Seeker", "Employer", "Admin"],
  },
  companyName: {
    type: String,
    validate: {
      validator: function (value) {
        if (this.role === "Employer" && (!value || value.trim().length === 0)) {
          return false;
        }
        return true;
      },
      message: "Company name is required for Employers.",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getJWTToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const User = mongoose.model("User", UserSchema);
