import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchApplicationsByJobId,
  clearAllApplicationErrors,
  deleteApplication,
  updateApplicationStatus,
} from "../store/Slices/applicationSlice";
import { toast } from "react-toastify";
import Spinner from "./Spinner"
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

const ApplicationsByJob = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { applications, loading, error } = useSelector(
    (state) => state.applications
  );
  

  useEffect(() => {
    dispatch(fetchApplicationsByJobId(jobId));
    if (error) {
   
      dispatch(clearAllApplicationErrors());
    }
  }, [dispatch, jobId, error]);

  const handleDeleteApplication = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This application will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteApplication(id))
          .then(() => {
            Swal.fire("Deleted!", "The application has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error", "Could not delete the application.", "error");
          });
      }
    });
  };

   const handleChangeStatus = (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to change the application status to "${status}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateApplicationStatus({ id, status }))
          .then(() => {
            Swal.fire(
              "Updated!",
              "Application status updated successfully.",
              "success"
            );
          })
          .catch(() => {
            Swal.fire(
              "Error",
              "There was a problem updating the status.",
              "error"
            );
          });
      }
    });
  };
  
  return (
    <div className="account_components">
         <IoArrowBackOutline size={24} onClick={() => {
                navigate(-1)}
               } />
      <div>
      <h3 style={{ color: "#0077b6" }}>
  Applications for the job
</h3>

       
      </div>

      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <p>No applications for this job yet.</p>
      ) : (
        <div className="applications-table-wrapper" style={{ overflowX: "auto", marginTop: "20px" }}>
          <table className="jobs-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#0077b6", color: "#fff" }}>
                <th style={{ padding: "10px" }}>Candidate Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Resume & Cover Letter</th>
                
                <th>Status</th>
                <th>Delete</th>

              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} style={{ borderBottom: "1px solid #ccc" }}>
                  <td style={{ padding: "10px" }}>{app.jobSeekerInfo.name}</td>
                  <td>{app.jobSeekerInfo.email}</td>
                  <td>{app.jobSeekerInfo.phone}</td>
                  <td>
  <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
    <a
      href={app.jobSeekerInfo.resume.url}
      target="_blank"
      rel="noreferrer"
      style={{
        padding: "6px 6px",
        backgroundColor: "#e0f7fa",
        marginBottom:'4px',
        color: "#0077b6",
        borderRadius: "5px",
        textDecoration: "none",
        fontWeight: "500",
        display: "inline-block",
        transition: "all 0.3s ease",
      }}
    >
      📄Resume
    </a>

    <a
      href={app.jobSeekerInfo.coverLetter.url}
      target="_blank"
      rel="noreferrer"
      style={{
        padding: "6px 6px",
        backgroundColor: "#fff3e0",
        color: "#f57c00",
        borderRadius: "5px",
        textDecoration: "none",
        fontWeight: "500",
        display: "inline-block",
        transition: "all 0.3s ease",
      }}
    >
      📝CoverLetter
    </a>
  </div>
</td>

                  <td>
                  <select 
  id="status" 
  value={app.status || "pending"}
  onChange={(e) => handleChangeStatus(app._id, e.target.value)}
  style={{
    padding: "6px 6px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  }}
>
  <option value="pending">⏳ Pending</option>
  <option value="accepted">✅ Accepted</option>
  <option value="rejected">❌ Rejected</option>
</select>
          
                  </td>
                  <td>
  <button
    onClick={() => handleDeleteApplication(app._id)}
   
    style={{
      backgroundColor: "transparent",
      color: "#f44336",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
    }}
  >
    🗑️
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ApplicationsByJob;
