import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js"; // Correction de la casse du dossier
import { Job } from "../database/models/jobSchema.js";

export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsabilities,
    degreeLevel,
    certifications = [], // Valeur par défaut pour éviter undefined
    requiredTechSkills,
    yearsOfExperience,
    personalAttributes = [], // Facultatif, donc on met une valeur par défaut
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite,
    jobField,
    newsLetterSend,
  } = req.body;

  // Vérification des champs obligatoires
  if (
    !title ||
    !jobType ||
    !location ||
    !companyName ||
    !introduction ||
    !responsabilities ||
    !degreeLevel ||
    !requiredTechSkills ||
    !yearsOfExperience ||
    !salary ||
    !jobField
  ) {
    return next(
      new ErrorHandler("Please provide all required job details.", 400)
    );
  }

  const urlRegex = /^https?:\/\/[^\s$.?#].[^\s]*$/gm;
  if (!urlRegex.test(personalWebsite)) {
    return next(
      new ErrorHandler("Invalid URL format for personalWebsite.", 400)
    );
  }

  // Création de l'objet qualifications
  const qualifications = {
    degreeLevel,
    certifications,
    requiredTechSkills,
    yearsOfExperience,
    personalAttributes,
  };

  const postedBy = req.user._id; // Récupération de l'utilisateur qui poste l'offre

  // Création du job
  const job = await Job.create({
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsabilities,
    qualifications,
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite,
    jobField,
    newsLetterSend,
    postedBy, // Ajout du champ "postedBy"
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const {
    city,
    field,
    searchKeyword,
    salaryMin,
    companyName,
    degreeLevel,
    yearsOfExperience,
    hiringMultipleCandidates,
    jobType,
  } = req.query;

  const query = {};

  //  Filtrage par ville
  if (city) {
    query.location = city;
  }

  // Filtrage par domaine
  if (field) {
    query.jobField = field;
  }

  //  Recherche texte
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { companyName: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  // Filtrage par fourchette de salaire
  if (salaryMin) {
    query.salary = {};
    if (salaryMin) query.salary.$gte = parseInt(salaryMin);
  }

  // Recherche par nom d'entreprise
  if (companyName) {
    query.companyName = { $regex: companyName, $options: "i" };
  }

  //  Niveau de diplôme requis
  if (degreeLevel) {
    query["qualifications.degreeLevel"] = degreeLevel;
  }

  // Années d'expérience minimum
  if (yearsOfExperience) {
    query["qualifications.yearsOfExperience"] = {
      $gte: parseInt(yearsOfExperience),
    };
  }

  //  Recrutement multiple
  if (hiringMultipleCandidates !== undefined) {
    query.hiringMultipleCandidates = hiringMultipleCandidates === "true";
  }

  // Type de contrat (plusieurs types possibles)
  if (jobType) {
    const types = Array.isArray(jobType) ? jobType : [jobType];
    query.jobType = { $in: types };
  }

  // Exécution de la recherche
  const jobs = await Job.find(query);

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

export const getMyJobs = catchAsyncErrors(async (req, res, next) => {
  const { searchKeyword } = req.query;

  const query = {
    postedBy: req.user._id,
  };

  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { jobType: { $regex: searchKeyword, $options: "i" } },
      { introduction: { $regex: searchKeyword, $options: "i" } },
      { jobField: { $regex: searchKeyword, $options: "i" } },
      { location: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  const myJobs = await Job.find(query);

  res.status(200).json({
    success: true,
    myJobs,
  });
});

export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Oops! Job not found.", 404));
  }
  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job deleted.",
  });
});
export const getAllCompanyNames = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find().select("companyName");

  // Extraire uniquement les noms et retirer les doublons
  const companyNames = [...new Set(jobs.map((job) => job.companyName))];

  res.status(200).json({
    success: true,
    companyNames,
    count: companyNames.length,
  });
});

export const getASingleJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }
  res.status(200).json({
    success: true,
    job,
  });
});

export const editJob = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    jobType,
    location,
    companyName,
    introduction,
    responsabilities,
    degreeLevel,
    certifications = [],
    requiredTechSkills,
    yearsOfExperience,
    personalAttributes = [],
    offers,
    salary,
    hiringMultipleCandidates,
    personalWebsite,
    jobField,
    newsLetterSend,
  } = req.body;

  // Recherche du job à éditer
  const job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // Vérification des droits d'édition
  if (
    req.user.role !== "Admin" &&
    job.postedBy.toString() !== req.user._id.toString()
  ) {
    return next(
      new ErrorHandler("You are not authorized to edit this job.", 403)
    );
  }

  // Mise à jour des champs
  job.title = title || job.title;
  job.jobType = jobType || job.jobType;
  job.location = location || job.location;
  job.companyName = companyName || job.companyName;
  job.introduction = introduction || job.introduction;
  job.responsabilities = responsabilities || job.responsabilities;
  job.degreeLevel = degreeLevel || job.degreeLevel;

  // Vérification et mise à jour des qualifications
  job.qualifications.certifications =
    Array.isArray(certifications) && certifications.length
      ? certifications
      : job.qualifications.certifications;
  job.qualifications.requiredTechSkills =
    requiredTechSkills || job.qualifications.requiredTechSkills;
  job.qualifications.yearsOfExperience =
    yearsOfExperience || job.qualifications.yearsOfExperience;
  job.qualifications.personalAttributes =
    Array.isArray(personalAttributes) && personalAttributes.length
      ? personalAttributes
      : job.qualifications.personalAttributes;

  job.offers = offers || job.offers;
  job.salary = salary || job.salary;
  job.hiringMultipleCandidates =
    hiringMultipleCandidates || job.hiringMultipleCandidates;
  job.personalWebsite = personalWebsite || job.personalWebsite;
  job.jobField = jobField || job.jobField;
  job.newsLetterSend =
    newsLetterSend !== undefined ? newsLetterSend : job.newsLetterSend;

  // Sauvegarde du job mis à jour
  await job.save();

  res.status(200).json({
    success: true,
    message: "Job updated successfully.",
    job,
  });
});
