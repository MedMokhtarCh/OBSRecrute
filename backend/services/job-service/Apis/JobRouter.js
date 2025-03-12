import express from "express";

import {
  deleteJob,
  editJob,
  getAllJobs,
  getASingleJob,
  getMyJobs,
  postJob,
} from "../controllers/jobController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/Authen.js";

const router = express.Router();
router.post(
  "/post",
  isAuthenticated,
  isAuthorized("Admin", "Employer"),
  postJob
);
router.get("/getall", getAllJobs);
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs);
router.delete(
  "/delete/:id",
  isAuthenticated,
  isAuthorized("Admin", "Employer"),
  deleteJob
);
router.get("/get/:id", getASingleJob);

router.put(
  "/edit/:id",
  isAuthenticated,
  isAuthorized("Admin", "Employer"), // Autorise l'admin et l'employeur à éditer
  editJob
);

export default router;
