import {
  deleteApplication,
  employerGetAllApplication,
  jobSeekerGetAllApplication,
  postApplication,
  updateApplicationStatus,
  getApplicationsByJobId,
  getApplicationById,
} from "../Controllers/ApplicationController.js";
import { isAuthenticated, isAuthorized } from "../Middlewares/Authen.js";
import express from "express";

const router = express.Router();

router.post(
  "/post/:id",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  postApplication
);
router.get("/applications/:id", getApplicationById);

router.get(
  "/employer/getall",
  isAuthenticated,
  isAuthorized("Employer"),
  employerGetAllApplication
);

router.get(
  "/jobseeker/getall",
  isAuthenticated,
  isAuthorized("Job Seeker"),
  jobSeekerGetAllApplication
);

router.get(
  "/applications/job/:jobId",
  isAuthenticated,
  isAuthorized("Employer", "Job Seeker"),
  getApplicationsByJobId
);
router.delete("/delete/:id", isAuthenticated, deleteApplication);

router.patch(
  "/updateStatus/:id",
  isAuthenticated,
  isAuthorized("Employer"),
  updateApplicationStatus
);

export default router;
