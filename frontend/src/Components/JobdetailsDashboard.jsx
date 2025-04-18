import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdCash } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { FaToolbox, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import { fetchSingleJob } from "../store/Slices/jobSlice";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";


const containerStyle = {
  

  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "1rem",
  maxWidth: "900px",
 
  fontFamily: "Poppins, sans-serif",
  
};

const sectionStyle = {
  marginTop: "30px",
  padding: "20px",
  borderRadius: "10px",
  backgroundColor: "#f8f9fa",
};

const sectionTitleStyle = {
  fontSize: "1rem",
  color: "#007bff",
  marginBottom: "15px",
  fontWeight: "700",
};

const listItemStyle = {
  paddingLeft: "20px",
  lineHeight: "1.8",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const jobTitleStyle = {
  fontSize: "2rem",
  fontWeight: "700",
  color: "#333",
  textAlign: "center",
};

const salaryStyle = {
  fontSize: "1rem",
  color: "#88ea98",
  fontWeight: "700",
};

const linkStyle = {
  color: "#007bff",
  fontWeight: "600",
  textDecoration: "none",
};

const JobDetailsDashboard = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [ForMyJobs,setForMyJobs]=useState(false)
  useEffect(() => {
    dispatch(fetchSingleJob(jobId)); // Fetch job details
  }, [dispatch, jobId]);

  return (
    
    <div >
      {/* HEADER */}
      <IoArrowBackOutline color="black" size={24} onClick={() => {
        navigate(-1)}
       } />
 

      <header style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={jobTitleStyle}>{singleJob.title} </h1>
        <p>
          📍 {singleJob.location} | 💰 <span style={salaryStyle}>{singleJob.salary} </span>
        </p>
        {singleJob.personalWebsite && (
          <Link to={singleJob.personalWebsite} target="_blank" style={linkStyle}>
            🌍 {singleJob.personalWebsite}
          </Link>
        )}
      </header>

      {/* RESPONSABILITÉS 📌 */}
      {singleJob.responsabilities && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📌 Responsibilities</h2>
          <ul>
            {singleJob.responsabilities.split(". ").map((task, index) => (
              <li key={index} style={listItemStyle}>✅ {task}</li>
            ))}
          </ul>
        </section>
      )}

      {/* OFFRES 🎁 */}
      {singleJob.offers && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}> What We Offer</h2>
          <ul>
            {singleJob.offers.split(", ").map((offer, index) => (
              <li key={index} style={listItemStyle}>🎯 {offer}</li>
            ))}
          </ul>
        </section>
      )}

      {/* QUALIFICATIONS 🎓 */}
      {singleJob.qualifications && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}> Qualifications</h2>
          <ul>
            <li style={listItemStyle}>🎓 <strong>Degree Level:</strong> {singleJob.qualifications.degreeLevel}</li>

            {/* Certifications */}
            {singleJob.qualifications.certifications?.length > 0 && (
              <li style={listItemStyle}>
                🏅 <strong>Certifications:</strong>
                <ul>
                  {singleJob.qualifications.certifications.map((cert, index) => (
                    <li key={index} style={listItemStyle}>📌 {cert}</li>
                  ))}
                </ul>
              </li>
            )}

            {/* Compétences techniques requises */}
            {singleJob.qualifications.requiredTechSkills?.length > 0 && (
              <li style={listItemStyle}>
                💻 <strong>Required Tech Skills:</strong>
                <ul>
                  {singleJob.qualifications.requiredTechSkills.map((skill, index) => (
                    <li key={index} style={listItemStyle}> {skill}</li>
                  ))}
                </ul>
              </li>
            )}

            {/* Attributs personnels */}
            {singleJob.qualifications.personalAttributes?.length > 0 && (
              <li style={listItemStyle}>
                🌟 <strong>Personal Attributes:</strong>
                <ul>
                  {singleJob.qualifications.personalAttributes.map((attr, index) => (
                    <li key={index} style={listItemStyle}>💡 {attr}</li>
                  ))}
                </ul>
              </li>
            )}

            {/* Années d'expérience */}
            <li style={listItemStyle}>📅 <strong>Years of Experience:</strong> {singleJob.qualifications.yearsOfExperience} years</li>
          </ul>
        </section>
      )}

      {/* DOMAINE DU JOB 🔍 */}
      {singleJob.jobField && (
        <section style={sectionStyle}>
          <h2 style={sectionTitleStyle}>🔍 Job Field</h2>
          <p>{singleJob.jobField}</p>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ textAlign: "center", marginTop: "30px" }}>
        <p> 🔗 For more details, visit the company's website.</p>
        {singleJob.personalWebsite && (
          <Link to={singleJob.personalWebsite} target="_blank" style={linkStyle}>
             {singleJob.personalWebsite}
          </Link>
        )}
      </footer>
    </div>
  );
};

export default JobDetailsDashboard;
