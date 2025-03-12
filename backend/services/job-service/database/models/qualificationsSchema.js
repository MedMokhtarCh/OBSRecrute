import mongoose from "mongoose";

const qualificationsSchema = new mongoose.Schema({
  degreeLevel: {
    type: String,
    enum: ["Bachelor's", "Master's", "PhD", "Other"],
    required: true,
  },
  certifications: {
    type: [String],
    default: [],
  },
  requiredTechSkills: {
    type: [String],
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    required: true,
  },
  personalAttributes: {
    type: [String],
    default: [],
  },
});

export default qualificationsSchema;
