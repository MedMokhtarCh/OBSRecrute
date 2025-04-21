import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import validator from "validator";

dotenv.config();

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

  profilePicture: {
    public_id: String,
    url: String,
  },
  diplomas: [
    {
      title: String,
      institution: String,
      year: Number,
    },
  ],
  certifications: [
    {
      title: String,
      year: Number,
    },
  ],

  technicalSkills: [String],
  softSkills: [String],

  languages: [
    {
      name: String,
      level: String, // Exemple : "Débutant", "Intermédiaire", "Avancé", "Natif"
    },
  ],

  education: [
    {
      degree: String,
      school: String,
      startYear: Number,
      endYear: Number,
    },
  ],
  experiences: [
    {
      jobTitle: String,
      company: String,
      description: String,
      startDate: Date,
      endDate: Date,
    },
  ],
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must contain at least 8 characters."],
    maxLength: [32, "Password cannot exceed 32 characters"],
    select: false,
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
  companyProfile: {
    description: String,
    sector: String,
    location: String,
  },
  companyLogo: {
    public_id: String,
    url: String,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordOTP: String,
  resetPasswordOTPExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔑 Méthodes
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export const User = mongoose.model("User", UserSchema);
