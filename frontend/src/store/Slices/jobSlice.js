import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
    companyNames: [],
    message: null,
    singleJob: {},
    myJobs: [],
  },
  reducers: {
    requestForAllJobs(state, action) {
      state.loading = true;
      state.error = null;
    },
    successForAllJobs(state, action) {
      state.loading = false;
      state.jobs = action.payload;
      state.error = null;
    },
    failureForAllJobs(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    requestForSingleJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForSingleJob(state, action) {
      state.loading = false;
      state.error = null;
      state.singleJob = action.payload;
    },
    failureForSingleJob(state, action) {
      state.singleJob = state.singleJob;
      state.error = action.payload;
      state.loading = false;
    },
    requestForPostJob(state, action) {
      state.message = null;
      state.error = null;
      state.loading = true;
    },
    successForPostJob(state, action) {
      state.message = action.payload;
      state.error = null;
      state.loading = false;
    },
    failureForPostJob(state, action) {
      state.message = null;
      state.error = action.payload;
      state.loading = false;
    },

    requestForDeleteJob(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    successForDeleteJob(state, action) {
      state.loading = false;
      state.error = null;
      state.message = action.payload;
    },
    failureForDeleteJob(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },

    requestForMyJobs(state, action) {
      state.loading = true;
      state.myJobs = [];
      state.error = null;
    },
    successForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = action.payload || [];
      state.error = null;
    },
    failureForMyJobs(state, action) {
      state.loading = false;
      state.myJobs = state.myJobs;
      state.error = action.payload;
    },

    clearAllErrors(state, action) {
      state.error = null;
      state.jobs = state.jobs;
    },
    resetJobSlice(state, action) {
      state.error = null;
      state.jobs = state.jobs;
      state.loading = false;
      state.message = null;
      state.myJobs = state.myJobs;
      state.singleJob = {};
    },

    requestForEditJob(state, action) {
      state.loading = true;
      state.error = null;
    },
    successForEditJob(state, action) {
      state.loading = false;
      state.message = action.payload.message; // Message de succès
      state.error = null;
      state.singleJob = action.payload.job; // Job mis à jour
    },
    failureForEditJob(state, action) {
      state.loading = false;
      state.error = action.payload; // Erreur reçue
    },
    requestForAllCompanyNames(state, action) {
      state.loading = true;
      state.error = null;
    },
    successForAllCompanyNames(state, action) {
      state.loading = false;
      state.error = null;
      state.companyNames = action.payload;
    },
    failureForAllCompanyNames(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const fetchJobs =
  (
    city,
    field,
    searchKeyword = "",
    salaryMin = "",
    companyName = "",
    degreeLevel = "",
    yearsOfExperience = "",
    jobType = "",
    hiringMultipleCandidates = ""
  ) =>
  async (dispatch) => {
    try {
      dispatch(jobSlice.actions.requestForAllJobs());

      let link = "http://localhost:4002/api/v1/job/getAll?";
      let queryParams = [];

      // Ajouter les filtres de recherche par mot-clé
      if (searchKeyword) {
        queryParams.push(`searchKeyword=${searchKeyword}`);
      }

      // Filtrage par ville
      if (city && city !== "All") {
        queryParams.push(`city=${city}`);
      }

      // Filtrage par domaine
      if (field && field !== "All") {
        queryParams.push(`field=${field}`);
      }

      // Fourchette de salaire
      if (salaryMin) {
        queryParams.push(`salaryMin=${salaryMin}`);
      }

      // Filtrage par nom d'entreprise
      if (companyName) {
        queryParams.push(`companyName=${companyName}`);
      }

      // Niveau de diplôme
      if (degreeLevel) {
        queryParams.push(`degreeLevel=${degreeLevel}`);
      }

      // Années d'expérience
      if (yearsOfExperience) {
        queryParams.push(`yearsOfExperience=${yearsOfExperience}`);
      }

      // Recrutement multiple
      if (hiringMultipleCandidates !== null) {
        queryParams.push(
          `hiringMultipleCandidates=${hiringMultipleCandidates}`
        );
      }

      // Type de contrat
      if (jobType) {
        queryParams.push(`jobType=${jobType}`);
      }

      // Ajoutez les paramètres à l'URL
      if (queryParams.length > 0) {
        link += queryParams.join("&");
      }

      // Effectuer la requête GET
      const response = await axios.get(link, { withCredentials: true });

      // Dispatch des résultats de la recherche
      dispatch(jobSlice.actions.successForAllJobs(response.data.jobs));
      dispatch(jobSlice.actions.clearAllErrors());
    } catch (error) {
      dispatch(jobSlice.actions.failureForAllJobs(error.response.data.message));
    }
  };

export const fetchSingleJob = (jobId) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForSingleJob());
  try {
    const response = await axios.get(
      `http://localhost:4002/api/v1/job/get/${jobId}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForSingleJob(response.data.job));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForSingleJob(error.response.data.message));
  }
};
export const postJob = (data) => async (dispatch) => {
  console.log("Données envoyées au backend :", data);
  dispatch(jobSlice.actions.requestForPostJob());
  try {
    const response = await axios.post(
      `http://localhost:4002/api/v1/job/post`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForPostJob(response.data.message));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForPostJob(error.response.data.message));
  }
};

export const getMyJobs = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForMyJobs());
  try {
    const response = await axios.get(
      `http://localhost:4002/api/v1/job/getmyjobs`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForMyJobs(response.data.myJobs));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForMyJobs(error.response.data.message));
  }
};

export const deleteJob = (id) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForDeleteJob());
  try {
    const response = await axios.delete(
      `http://localhost:4002/api/v1/job/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(jobSlice.actions.successForDeleteJob(response.data.message));
    dispatch(clearAllJobErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForDeleteJob(error.response.data.message));
  }
};
export const getAllCompanyNames = () => async (dispatch) => {
  dispatch(jobSlice.actions.requestForAllCompanyNames());
  try {
    const response = await axios.get(
      `http://localhost:4002/api/v1/job/companies`,
      { withCredentials: true }
    );
    dispatch(
      jobSlice.actions.successForAllCompanyNames(response.data.companyNames)
    );
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(
      jobSlice.actions.failureForAllCompanyNames(
        error.response?.data?.message || "Error retrieving company names"
      )
    );
  }
};

export const editJob = (id, data) => async (dispatch) => {
  dispatch(jobSlice.actions.requestForEditJob());
  try {
    const response = await axios.put(
      `http://localhost:4002/api/v1/job/edit/${id}`,
      data,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(jobSlice.actions.successForEditJob(response.data));
    dispatch(jobSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(jobSlice.actions.failureForEditJob(error.response.data.message));
  }
};
export const clearAllJobErrors = () => (dispatch) => {
  dispatch(jobSlice.actions.clearAllErrors());
};

export const resetJobSlice = () => (dispatch) => {
  dispatch(jobSlice.actions.resetJobSlice());
};

export default jobSlice.reducer;
