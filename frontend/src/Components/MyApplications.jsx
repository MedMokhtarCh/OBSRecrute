import React, { useEffect, useState } from "react"; 
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
import Swal from "sweetalert2";
import { FaBriefcase, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEye } from "react-icons/fa";

const MyApplications = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
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
  // Adjust styles dynamically based on window width
  
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
  const subSecStyle = {
    fontSize: "1rem",
    marginBottom: "8px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
  

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div  style={containerStyle}>
      {loading ? (
        <Spinner />
      ) : applications && applications.length <= 0 ? (
        <h1 style={headerStyle}>
          📭 You have not applied for any job.
        </h1>
      ) : (
       
        <div style={containerStyle}>
          <h3 style={headerStyle}>📂 My Applications</h3>
          <div style={applicationsContainerStyle}>
            {applications.map((element) => (
              <div style={cardStyle} key={element._id} >
                <p style={subSecStyle}>
                  <FaBriefcase /> <strong>Job:</strong> {element.jobInfo.jobTitle}
                  <Link to={`/dashboard/jobDetails/${element.jobInfo.jobId}`} style={{ marginLeft: "8px" }}>
                    <FaEye style={{ color: "#0288d1", fontSize: "1.2rem" }} />
                  </Link>
                </p>

                <p style={textStyle}>👤 <strong>Applicant:</strong> {element.jobSeekerInfo.name}</p>
                <p style={textStyle}>✉️ <strong>Email:</strong> {element.jobSeekerInfo.email}</p>
                <p style={textStyle}>📞 <strong>Phone:</strong> {element.jobSeekerInfo.phone}</p>
                <p style={textStyle}>📍 <strong>Address:</strong> {element.jobSeekerInfo.address}</p>
                

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
        </div>
      )}
    </div>
  );
};

export default MyApplications;