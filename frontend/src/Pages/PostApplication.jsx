import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useDropzone } from "react-dropzone"; // Import de react-dropzone

import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from "../store/Slices/applicationSlice";
import { fetchSingleJob } from "../store/Slices/jobSlice";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaFileUpload, FaBriefcase } from "react-icons/fa";

// Styles
const fileInputStyle = {
  padding: "12px 16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
  display: "block",
  width: "100%",
  cursor: "pointer",
  backgroundColor: "#fdfdfd",
  transition: "border-color 0.3s, box-shadow 0.3s",
  outline: "none",
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

const rowStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
};

const halfWidthInput = {
  ...inputStyle,
  width: "100%",
  flex: 1,
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "14px 28px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontSize: "1.1rem",
  fontWeight: "600",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 14px rgba(0, 123, 255, 0.2)",
};

const buttonHoverStyle = {
  transform: "translateY(-2px)",
  boxShadow: "0 8px 18px rgba(0, 123, 255, 0.25)",
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
  const [resumeName, setResumeName] = useState(""); 
  const [CoverletterName, setcoverletterName] = useState(""); 
  const [hovered, setHovered] = useState(false);
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

    dispatch(postApplication(formData, jobId));
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      Swal.fire({
        title: "Success",
        text: message,
        icon: "success",
        confirmButtonText: "OK",
      });
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, jobId, error, message]);

  const { getRootProps: getCoverLetterProps, getInputProps: getCoverLetterInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("Dropped files for cover letter:", acceptedFiles); // Check the files here
      if (acceptedFiles[0]) {
        setCoverLetter(acceptedFiles[0]);
        setcoverletterName(acceptedFiles[0].name); // Set resume name after file drop
      }
    },
    accept: ".pdf, .doc, .docx, .txt",
  });

  const { getRootProps: getResumeProps, getInputProps: getResumeInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("Dropped files for resume:", acceptedFiles); // Check the files here
      if (acceptedFiles[0]) {
        setResume(acceptedFiles[0]);
        setResumeName(acceptedFiles[0].name); // Set resume name after file drop
      }
    },
    accept: ".pdf, .doc, .docx",
  });

  return (
    <article
      style={{
        backgroundColor: "transparent",
       
        borderRadius: "0px", 
      boxShadow: "none", 
      }}
    >
      <form
        onSubmit={handlePostApplication}
        style={{
          backgroundColor: "#ffffff",
          padding: "32px",
          borderRadius: "12px",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
          maxWidth: "720px",
          width: "100%",
        }}
      >
      <h2 style={{ textAlign: "center", color: "#007bff", marginBottom: "50px" }}>
  📋 Application Form
</h2>
<p style={{ textAlign: "center", color: "#555", marginBottom: "32px" }}>
  Please fill in your details to apply for{" "}
  <strong style={{ color: "#28a745" }}>{singleJob.title}</strong>
</p>

        <div style={rowStyle}>
         
          <div style={{ flex: 1 }}>
            <label style={labelStyle}><FaEnvelope /> Your Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={halfWidthInput} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}><FaPhone /> Phone Number</label>
            <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} style={halfWidthInput} />
          </div>
        </div>
        {/* Cover Letter & Resume (For Job Seekers) */}
        {/* Cover Letter & Resume (For Job Seekers) */}
{user && user.role === "Job Seeker" && (
  <div style={rowStyle}>
    {/* Resume Upload */}
    <div style={{ flex: 1 }}>
      <label style={labelStyle}><FaFileUpload /> Resume</label>
      <div
        {...getResumeProps()}
        style={{
          border: "2px dashed #007bff",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: "100px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <input {...getResumeInputProps()} />
        {resumeName ? (
          <p style={{
            color: "#28a745",
            marginTop: "10px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ✅ <span><strong>Selected:</strong> {resumeName}</span>
          </p>
        ) : (
          <p style={{
            color: "#6c757d",
            marginTop: "10px",
            fontStyle: "italic"
          }}>
            Drag & Drop your resume here, or click to select
          </p>
        )}
      </div>
    </div>

    {/* Cover Letter Upload */}
    <div style={{ flex: 1 }}>
      <label style={labelStyle}><FaFileAlt /> Cover Letter</label>
      <div
        {...getCoverLetterProps()}
        style={{
          border: "2px dashed #007bff",
          padding: "40px",
          borderRadius: "10px",
          textAlign: "center",
          cursor: "pointer",
          minHeight: "100px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <input {...getCoverLetterInputProps()} />
        {CoverletterName ? (
          <p style={{
            color: "#28a745",
            marginTop: "10px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            ✅ <span><strong>Selected:</strong> {CoverletterName}</span>
          </p>
        ) : (
          <p style={{
            color: "#6c757d",
            marginTop: "10px",
            fontStyle: "italic"
          }}>
            Drag & Drop your cover letter here, or click to select
          </p>
        )}
      </div>
    </div>
  </div>
)}


        {/* Apply Button */}
        {isAuthenticated && user.role === "Job Seeker" && (
         
           <button
  type="submit"
  style={hovered ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  disabled={loading}
>
  <i className="fa fa-check-circle"></i> Apply Now
</button>
         
        )}
      </form>
    </article>
  );
};

export default PostApplication;
