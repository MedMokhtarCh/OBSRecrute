import axios from "axios";
export const getJobById = async (jobId) => {
  try {
    const response = await axios.get(
      `${process.env.JOB_SERVICE_URL}/get/${jobId}`
    );
    console.log("Job fetched successfully:", response.data.job); // Log pour vérifier
    return response.data.job;
  } catch (error) {
    console.error("Error fetching job:", error); // Log pour l'erreur
    throw new Error("Job not found");
  }
};
