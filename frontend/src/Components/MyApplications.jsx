import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchJobSeekerApplications,
} from "../store/Slices/applicationSlice";
import Spinner from "./Spinner";
import { FaBriefcase, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye } from "react-icons/fa"; // Ajout de l'icône FaEye

const MyApplications = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, applications, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobSeekerApplications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      dispatch(fetchJobSeekerApplications());
    }
  }, [dispatch, error, message]);

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

  const containerStyle = {
    padding: "20px",
    margin: "0 auto",
    maxWidth: "1200px",
    backgroundColor: "#f4f7fc",
    borderRadius: "12px",
    textAlign: "center",
  };

  const cardStyle = {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: "24px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "transform 0.2s ease-in-out",
  };

  const headerStyle = {
    fontSize: "2rem",
    fontWeight: "600",
    marginBottom: "30px",
    color: "#222",
  };

  const subSecStyle = {
    fontSize: "1rem",
    marginBottom: "8px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const buttonWrapperStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "16px",
  };

  const buttonStyle = {
    padding: "10px 18px",
    backgroundColor: "#0288d1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
  };

  const outlineButtonStyle = {
    padding: "10px 18px",
    backgroundColor: "#fff",
    color: "#0288d1",
    border: "2px solid #0288d1",
    borderRadius: "6px",
    cursor: "pointer",
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          📭 You have not applied for any job.
        </h1>
      ) : (
        <div style={containerStyle}>
          <h3 style={headerStyle}>📂 My Applications</h3>
          <div className="applications_container">
            {applications.map((element) => (
              <div style={cardStyle} key={element._id} className="application-card">
                <p style={subSecStyle}>
                  <FaBriefcase /> <strong>Job:</strong>
                  <Link to={`/jobDetails/${element.jobInfo.jobId}`} style={{ color: "#0288d1", marginLeft: "8px" }}>
                    {element.jobInfo.jobTitle}
                  </Link>
                  <Link to={`/jobDetails/${element.jobInfo.jobId}`} style={{ marginLeft: "8px" }}>
                    <FaEye style={{ color: "#0288d1", fontSize: "1.2rem" }} /> {/* Icône de l'œil */}
                  </Link>
                </p>

                <p style={subSecStyle}><FaUser /> <strong>Name:</strong> {element.jobSeekerInfo.name}</p>
                <p style={subSecStyle}><FaEnvelope /> <strong>Email:</strong> {element.jobSeekerInfo.email}</p>
                <p style={subSecStyle}><FaPhone /> <strong>Phone:</strong> {element.jobSeekerInfo.phone}</p>
                <p style={subSecStyle}><FaMapMarkerAlt /> <strong>Address:</strong> {element.jobSeekerInfo.address}</p>

                <p style={subSecStyle}>
                  <strong>Status:</strong>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        element.status === "accepted"
                          ? "#388e3c"
                          : element.status === "rejected"
                          ? "#d32f2f"
                          : "#f57c00",
                    }}
                  >
                    {element.status === "pending"
                      ? "⏳ Pending"
                      : element.status === "accepted"
                      ? "✅ Accepted"
                      : "❌ Rejected"}
                  </span>
                </p>

                <div style={buttonWrapperStyle}>
                  <button
                    style={outlineButtonStyle}
                    onClick={() => handleDeleteApplication(element._id)}
                  >
                    ❌ Delete
                  </button>

                  {element.jobSeekerInfo.resume.url ? (
                    <a
                      href={element.jobSeekerInfo.resume.url}
                      style={buttonStyle}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📄 Resume
                    </a>
                  ) : (
                    <span>📄 No resume</span>
                  )}

                  {element.jobSeekerInfo.coverLetter.url ? (
                    <a
                      href={element.jobSeekerInfo.coverLetter.url}
                      style={buttonStyle}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      📝 Cover Letter
                    </a>
                  ) : (
                    <span>📝 No cover letter</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MyApplications;
