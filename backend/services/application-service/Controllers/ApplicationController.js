import cloudinary from "cloudinary";
import axios from "axios";
import { Application } from "../database/models/applicationSchema.js";
import { catchAsyncErrors } from "../Middlewares/catchAsyncErrors.js";
import ErrorHandler from "../Middlewares/error.js";
import dotenv from "dotenv";

dotenv.config();

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, coverLetter } = req.body;

  // Créer l'objet jobSeekerInfo avec les données
  const jobSeekerInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter, // Ne pas oublier de mettre à jour ceci avec les fichiers téléchargés
    role: "Job Seeker",
  };

  console.log(req.files);

  // Récupération des informations du job depuis le microservice Job-Service
  let jobDetails;
  try {
    const response = await axios.get(`${process.env.JOB_SERVICE_URL}/${id}`);
    jobDetails = response.data;

    // Ajoutez un log pour vérifier la réponse du microservice
    console.log(
      "Job details received from the Job Service:",
      JSON.stringify(jobDetails, null, 2)
    ); // Affiche la réponse en format lisible
    console.log("Job details structure:", jobDetails); // Affiche la structure brute

    // Vérification de la présence des informations nécessaires
    if (
      !jobDetails ||
      !jobDetails.job ||
      !jobDetails.job.title ||
      !jobDetails.job.postedBy
    ) {
      return next(
        new ErrorHandler("Job details are missing or incomplete.", 400)
      );
    }
  } catch (error) {
    return next(new ErrorHandler("Job not found or service unavailable.", 404));
  }

  // Vérifier si l'utilisateur a déjà postulé
  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "jobSeekerInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return next(
      new ErrorHandler("You have already applied for this job.", 400)
    );
  }

  // Upload du CV (resume)
  if (req.files && req.files.resume) {
    const { resume } = req.files;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: "Job_Seekers_Resume", access_mode: "public" }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(
          new ErrorHandler("Failed to upload resume to cloudinary.", 500)
        );
      }
      jobSeekerInfo.resume = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else {
    if (req.user && !req.user.resume.url) {
      return next(new ErrorHandler("Please upload your resume.", 400));
    }
    jobSeekerInfo.resume = {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    };
  }

  // Upload de la lettre de motivation (coverLetter)
  if (req.files && req.files.coverLetter) {
    const { coverLetter } = req.files;
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        coverLetter.tempFilePath,
        { folder: "Job_Seekers_CoverLetters", access_mode: "public" }
      );
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(
          new ErrorHandler("Failed to upload cover letter to cloudinary.", 500)
        );
      }
      jobSeekerInfo.coverLetter = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload cover letter", 500));
    }
  } else {
    if (req.user && !req.user.coverLetter.url) {
      return next(new ErrorHandler("Cover letter is required.", 400));
    }
    jobSeekerInfo.coverLetter = {
      public_id: req.user.coverLetter.public_id,
      url: req.user.coverLetter.url,
    };
  }

  // Informations sur l'employeur
  const employerInfo = {
    id: jobDetails.job.postedBy, // Vérifiez que `postedBy` est bien défini
    role: "Employer",
  };

  // Informations sur l'offre d'emploi
  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.job.title, // Vérifiez que `title` est bien défini
  };

  // Créer la candidature
  const application = await Application.create({
    jobSeekerInfo,
    employerInfo,
    jobInfo,
  });

  res.status(201).json({
    success: true,
    message: "Application submitted.",
    application,
  });
});

export const employerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "employerInfo.id": _id,
      "deletedBy.employer": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobSeekerGetAllApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { _id } = req.user;
    const applications = await Application.find({
      "jobSeekerInfo.id": _id,
      "deletedBy.jobSeeker": false,
    });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);

  if (!application) {
    return next(new ErrorHandler("Application not found.", 404));
  }

  const { role, _id } = req.user; // Récupérer l'ID de l'utilisateur connecté

  switch (role) {
    case "Job Seeker":
      // Vérifier que le candidat est bien celui qui a postulé
      if (application.jobSeekerInfo.id.toString() !== _id.toString()) {
        return next(new ErrorHandler("Unauthorized action.", 403));
      }
      application.deletedBy.jobSeeker = true;
      await application.save();
      break;

    case "Employer":
      // Vérifier que l'employeur est bien celui qui a publié l'offre
      if (application.employerInfo.id.toString() !== _id.toString()) {
        return next(new ErrorHandler("Unauthorized action.", 403));
      }
      application.deletedBy.employer = true;
      await application.save();
      break;

    default:
      return next(new ErrorHandler("Unauthorized action.", 403));
  }

  // Suppression définitive SEULEMENT si les deux parties ont supprimé
  if (application.deletedBy.employer && application.deletedBy.jobSeeker) {
    await application.deleteOne();
  }

  res.status(200).json({
    success: true,
    message: "Application deleted successfully.",
  });
});
export const getApplicationsByJobId = catchAsyncErrors(
  async (req, res, next) => {
    const { jobId } = req.params;

    // Chercher toutes les candidatures pour ce jobId
    const applications = await Application.find({ "jobInfo.jobId": jobId });

    // Si aucune candidature n'est trouvée
    if (!applications || applications.length === 0) {
      return next(new ErrorHandler("No applications found for this job.", 404));
    }

    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const updateApplicationStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Statut envoyé dans la requête

    const application = await Application.findById(id);

    if (!application) {
      return next(new ErrorHandler("Application not found.", 404));
    }

    // Vérifier que l'utilisateur est bien l'employeur concerné
    if (application.employerInfo.id.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("Unauthorized action.", 403));
    }

    // Vérifier que le statut est valide
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      return next(new ErrorHandler("Invalid status.", 400));
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  }
);
