import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from "../store/Slices/applicationSlice";
import { fetchSingleJob } from "../store/Slices/jobSlice";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaFileUpload, FaBriefcase } from "react-icons/fa";

// 🎨 CSS Styling
const formContainer = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "2rem",
  maxWidth: "600px",
  margin: "2rem auto",
  fontFamily: "Poppins, sans-serif",
  color: "#333",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "8px 0",
  borderRadius: "8px",
  border: "1px solid #ddd",
  fontSize: "1rem",
};

const labelStyle = {
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "10px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "12px 20px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "0.3s",
};

const buttonDisabledStyle = {
  ...buttonStyle,
  backgroundColor: "#ccc",
  cursor: "not-allowed",
};

const PostApplication = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.applications);
  const { jobId } = useParams();

  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [phone, setPhone] = useState(user ? user.phone : "");
  const [address, setAddress] = useState(user ? user.address : "");
  const [coverLetter, setCoverLetter] = useState(null);
  const [resume, setResume] = useState(null);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handlePostApplication = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    if (coverLetter) formData.append("coverLetter", coverLetter);
    if (resume) formData.append("resume", resume);

    console.log("Job ID:", jobId);
    console.log("Form Data:", formData);

    dispatch(postApplication(formData, jobId));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, jobId]);

  return (
    <article style={formContainer}>
      <form onSubmit={handlePostApplication}>
        <h2 style={{ textAlign: "center", color: "#007bff" }}>📋 Application Form</h2>

        {/* Job Title */}
        <div>
          <label style={labelStyle}><FaBriefcase /> Job Title</label>
          <input type="text" placeholder={singleJob.title} disabled style={inputStyle} />
        </div>

        {/* Name */}
        <div>
          <label style={labelStyle}><FaUser /> Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}><FaEnvelope /> Your Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        </div>

        {/* Phone */}
        <div>
          <label style={labelStyle}><FaPhone /> Phone Number</label>
          <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        </div>

        {/* Address */}
        <div>
          <label style={labelStyle}><FaMapMarkerAlt /> Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={inputStyle} />
        </div>

        {/* Cover Letter & Resume (For Job Seekers) */}
        {user && user.role === "Job Seeker" && (
          <>
            <div>
              <label style={labelStyle}><FaFileAlt /> Cover Letter</label>
              <input type="file" onChange={(e) => setCoverLetter(e.target.files[0])} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}><FaFileUpload /> Resume</label>
              <input type="file" onChange={(e) => setResume(e.target.files[0])} style={inputStyle} />
            </div>
          </>
        )}

        {/* Apply Button */}
        {isAuthenticated && user.role === "Job Seeker" && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button type="submit" style={loading ? buttonDisabledStyle : buttonStyle} disabled={loading}>
              <i className="fa fa-check-circle"></i> Apply Now
            </button>
          </div>
        )}
      </form>
    </article>
  );
};

export default PostApplication;
