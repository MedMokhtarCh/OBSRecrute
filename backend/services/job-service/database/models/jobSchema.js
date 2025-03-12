import mongoose from "mongoose";
import qualificationsSchema from "./qualificationsSchema.js";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["Full-time", "Part-time", "Internship", "Remote"],
  },
  location: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    maxlength: 500,
  },
  responsabilities: {
    type: String,
    required: true,
  },
  qualifications: qualificationsSchema,
  offers: {
    type: String,
  },
  salary: {
    type: String,
  },
  hiringMultipleCandidates: {
    type: Boolean,
    default: false,
  },
  personalWebsite: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/[^\s$.?#].[^\s]*$/gm.test(v); // Regex to validate URL format
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
  },
  jobField: {
    type: String,
    required: true,
  },
  newsLetterSend: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
