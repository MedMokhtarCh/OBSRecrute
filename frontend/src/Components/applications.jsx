import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { 
  clearAllApplicationErrors, 
  deleteApplication, 
  fetchEmployerApplications,
  resetApplicationSlice ,
  updateApplicationStatus
} from "../store/Slices/applicationSlice";
import Spinner from "./Spinner";
import Swal from "sweetalert2";
import {
 
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import '../styles/Applications.css'
const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
  
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
  
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchEmployerApplications());
  }, [dispatch, error, message]);

  const renderStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock style={{ color: "#38b2d9" }} />;
      case "accepted":
        return <FaCheckCircle style={{ color: "#388e3c" }} />;
      case "rejected":
        return <FaTimesCircle style={{ color: "#d32f2f" }} />;
      default:
        return null;
    }
  };

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
    <div style={containerStyle}>
      {loading ? (
        <Spinner />
      ) : applications.length === 0 ? (
        <h1 style={headerStyle}>📭 No applications received yet.</h1>
      ) : (
        <>
        
          <h3 style={headerStyle}>📋 Applications For Your Jobs</h3>
          <div style={applicationsContainerStyle}>
            {applications.map((element) => (
              <div style={cardStyle} key={element._id}>
                <p style={textStyle}>🛠 <strong>Job Title:</strong> {element.jobInfo.jobTitle}</p>
                <p style={textStyle}>👤 <strong>Applicant:</strong> {element.jobSeekerInfo.name}</p>
                <p style={textStyle}>✉️ <strong>Email:</strong> {element.jobSeekerInfo.email}</p>
                <p style={textStyle}>📞 <strong>Phone:</strong> {element.jobSeekerInfo.phone}</p>
                <p style={textStyle}>📍 <strong>Address:</strong> {element.jobSeekerInfo.address}</p>
                
                <div style={statusWrapperStyle}>
                  <label htmlFor="status" style={labelStyle}>⚖️ Status:</label>
                  <select 
  id="status" 
  value={element.status || "pending"}
  onChange={(e) => handleChangeStatus(element._id, e.target.value)}
  style={selectStyle}
>
  <option value="pending"> Pending</option>
  <option value="accepted">Accepted</option>
  <option value="rejected"> Rejected</option>
</select>
<span>{renderStatusIcon(element.status)}</span>
                </div>
                
                <div style={buttonWrapperStyle}>
                 
                  <Link to={element.jobSeekerInfo?.resume?.url} style={buttonStyle} target="_blank">
                    📄 View Resume
                  </Link>
                  <Link to={element.jobSeekerInfo?.coverLetter?.url} style={buttonStyle} target="_blank">
                    📝 View Cover Letter
                  </Link>
                  <Link
    onClick={() => handleDeleteApplication(element._id)}
   
    style={{
      backgroundColor: "transparent",
      color: "#f44336",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      textDecoration: "none"
    }}
  >
    🗑️
  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const containerStyle = {
  padding: "20px 20px",
  margin: "0 auto",
  maxWidth: "1000px",
 
  textAlign: "center",
};

const applicationsContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
  gap: "24px",
};

const cardStyle = {
  backgroundColor: "#f0f9fc",
  padding: "16px",  // Réduit le padding pour plus de compacité
  borderRadius: "12px",
  
  textAlign: "left",
  transition: "transform 0.2s ease",
  maxWidth: "400px", // Définit une largeur maximale pour la carte
  
};

const headerStyle = {
  fontSize: "Arem",
  fontWeight: "600",
  marginBottom: "50px",
  color: "#1f2937",
};

const textStyle = {
  fontSize: "1rem",
  marginBottom: "10px",
  color: "#4b5563",
  lineHeight: "1.5",
};

const statusWrapperStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
  marginTop: "10px",
};

const labelStyle = {
  fontWeight: "600",
  color: "#1f2937",
};

const selectStyle = {
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solidrgb(84, 121, 165)",
  fontSize: "14px",
  backgroundColor: "#f8fafc",
  color: "#1e293b",
  outline: "none",
  cursor: "pointer",
};

const buttonWrapperStyle = {
  display: "flex",
  
  marginTop: "20px",
  flexWrap: "wrap",
  gap: "10px",
};

const buttonStyle = {
  backgroundColor: "#e3f2fd",
  color: "#0077b6",
  border: "1px solidrgb(27, 127, 174)",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
  transition: "all 0.2s ease-in-out",
};

const outlineButtonStyle = {
  color: "#d32f2f",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  transition: "color 0.2s ease",
};



export default Applications;