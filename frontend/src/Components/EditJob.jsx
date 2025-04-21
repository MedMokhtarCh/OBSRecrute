import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { editJob, fetchSingleJob, clearAllJobErrors } from "../store/Slices/jobSlice"; // Ajoutez clearAllJobErrors
import { CiCircleInfo } from "react-icons/ci";
import FieldsArray from "../data/fields"; // Liste des secteurs d'activité
import cities from "../data/cities"; // Liste des villes
import { useParams , useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { SiOpensourcehardware } from "react-icons/si";
import { TbWorldWww } from "react-icons/tb";
import { GiGraduateCap } from "react-icons/gi";
import { GrCertificate } from "react-icons/gr";
import { CiLocationOn } from "react-icons/ci";
import { MdHomeWork, MdAttachMoney } from "react-icons/md";
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Swal from 'sweetalert2';


const JobEdit = () => {
  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("");
  const [location, setLocation] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [responsabilities, setResponsabilities] = useState("");
  const [qualifications, setQualifications] = useState({
    degreeLevel: "",
    certifications: [],
    requiredTechSkills: [],
    yearsOfExperience: "",
    personalAttributes: [],
  });
  const [offers, setOffers] = useState("");
  const [salary, setSalary] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState(false);

  const [personalWebsite, setPersonalWebsite] = useState("");
  const [jobField, setJobField] = useState("");
  const [newsLetterSend, setNewsLetterSend] = useState(false); // Variable pour la newsletter

  const { singleJob } = useSelector((state) => state.jobs);
  const { loading, error, message } = useSelector((state) => state.jobs);
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(fetchSingleJob(jobId)); // Fetch job details
  }, [dispatch, jobId]);

  // Soumission du formulaire pour éditer une offre d'emploi
  
  // Gérer les erreurs et les mises à jour réussies
  useEffect(() => {
    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      });
      dispatch(clearAllJobErrors());
    }
  
    if (message) {
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 2000,
        showConfirmButton: false,
      });
      dispatch(clearAllJobErrors());
    }
  }, [dispatch, error, message]);
  
  // Fonction de gestion du changement dans les qualifications
  const handleQualificationsChange = (field, value) => {
    setQualifications({
      ...qualifications,
      [field]: value,
    });
  };

  useEffect(() => {
    if (singleJob) {
      setTitle(singleJob.title || "");
      setPersonalWebsite(singleJob.personalWebsite || "");
      setJobField(singleJob.jobField || "");
      setLocation(singleJob.location || "");
      setSalary(singleJob.salary || "");
      setJobType(singleJob.jobType || "");
      setCompanyName(singleJob.companyName || "");
      setIntroduction(singleJob.introduction || "");
      setResponsabilities(singleJob.responsabilities || "");
      setOffers(singleJob.offers || "");
      setHiringMultipleCandidates(Boolean(singleJob.hiringMultipleCandidates));

      setNewsLetterSend(singleJob.newsLetterSend || false);
      
      // Initialize qualifications if available
      if (singleJob.qualifications) {
        setQualifications({
          degreeLevel: singleJob.qualifications.degreeLevel || "",
          certifications: singleJob.qualifications.certifications || [],
          requiredTechSkills: singleJob.qualifications.requiredTechSkills || [],
          yearsOfExperience: singleJob.qualifications.yearsOfExperience || "",
          personalAttributes: singleJob.qualifications.personalAttributes || [],
        });
      }
    }
  }, [singleJob]);

  const handleEditJob = (e) => {
    e.preventDefault();

    const jobData = {
      title,
      jobType,
      location,
      companyName,
      introduction,
      responsabilities,
      degreeLevel: qualifications.degreeLevel,
      certifications: qualifications.certifications.map((c) => c.trim()),
      requiredTechSkills: qualifications.requiredTechSkills.map((s) => s.trim()),
      yearsOfExperience: qualifications.yearsOfExperience,
      personalAttributes: qualifications.personalAttributes.map((a) => a.trim()),
      offers,
      salary,
      hiringMultipleCandidates: Boolean(hiringMultipleCandidates),
      personalWebsite,
      jobField,
      newsLetterSend,
    };

    dispatch(editJob(jobId, jobData));
  };
  return (
    <div >
       <IoArrowBackOutline size={24} onClick={() => navigate(-1)} />
      <h3>Edit the job ✏️</h3>
      
      <form onSubmit={handleEditJob}>
      <div className="field-row">
        <div>
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job Title"
          />
        </div>

        {/* Job Type */}
        <div>
          <label>Job Type</label>
          <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
            <option value="">Select Job Type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
        </div>

        <div className="field-row">
        <div>
          <label><CiLocationOn  color="black" style={{margin: '5px'}}/>  Location (City)  </label>
          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Select Job Location</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Company Name */}
        <div>
          <label><MdHomeWork color="black" style={{margin: '5px'}}/>   Company Name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
          />
        </div>
</div>
        {/* Job Introduction */}
        <div className="field-row">
        <div>
         
          <div className="label-infoTag-wrapper">
          <label>Company/Job Introduction</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          <textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            placeholder="Company / Job Introduction"
            rows={3}
          />
        </div>

       
        <div>
          <label>Responsabilities</label>
          <textarea
            value={responsabilities}
            onChange={(e) => setResponsibilities(e.target.value)}
            placeholder="Job Responsibilities"
            rows={3}
          />
        </div>
</div>
        <div className="field-row">
        <div>
          <label> <GiGraduateCap color="black" style={{margin: '5px'}} />Degree Level</label>
          <select
            value={qualifications.degreeLevel}
            onChange={(e) => handleQualificationsChange("degreeLevel", e.target.value)}
          >
            <option value="">Select Degree Level</option>
            <option value="Bachelor's">Bachelor's</option>
            <option value="Master's">Master's</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Certifications */}
        <div>
        <div className="label-infoTag-wrapper">
        <label> <GrCertificate color="black" style={{margin: '5px'}} />Certifications</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          
          <input
            type="text"
            value={qualifications.certifications.join(", ")}
            onChange={(e) =>
              handleQualificationsChange("certifications", e.target.value.split(","))
            }
            placeholder="Enter certifications, separated by commas"
          />
        </div>
        </div>
        

        <div className="field-row">
        <div>
          <label> <SiOpensourcehardware color="black" style={{margin: '5px'}}/>Required Tech Skills</label>
          <input
            type="text"
            value={qualifications.requiredTechSkills.join(", ")}
            onChange={(e) =>
              handleQualificationsChange("requiredTechSkills", e.target.value.split(","))
            }
            placeholder="Enter tech skills, separated by commas"
          />
        </div>

        {/* Years of Experience */}
        <div>
          <label>Years of Experience</label>
          <input
            type="number"
            value={qualifications.yearsOfExperience}
            onChange={(e) =>
              handleQualificationsChange("yearsOfExperience", e.target.value)
            }
            placeholder="Enter years of experience"
          />
        </div>

</div>

{/* Offers */}

        <div className="field-row">
          <div style={{ gridColumn: "span 2" }}>
            <div className="label-infoTag-wrapper">
              <label>What We Offer</label>
              <span>
                <CiCircleInfo /> Optional
              </span>
            </div>
            <textarea
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
              placeholder="What are we offering in return!"
              rows={4}
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>
      
        <div className="field-row">
        <div>
        <div className="label-infoTag-wrapper">
        <label>Personal Attributes</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
         
          <input
            type="text"
            value={qualifications.personalAttributes.join(", ")}
            onChange={(e) =>
              handleQualificationsChange("personalAttributes", e.target.value.split(","))
            }
            placeholder="Enter personal attributes, separated by commas"
          />
        </div>

        
        <div>
          <label>Job Field</label>
          <select value={jobField} onChange={(e) => setJobField(e.target.value)}>
            <option value="">Select Job field</option>
            {FieldsArray.map((field) => (
              <option key={field} value={field}>
                {field}
              </option>
            ))}
          </select>
        </div>

</div>
      
      
<div className="field-row">
        <div>
        <div className="label-infoTag-wrapper">
        <label><MdAttachMoney color="black" style={{margin: '5px'}} />Salary</label>
            <span>
              <CiCircleInfo /> Optional
            </span>
          </div>
          
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="50000 - 800000"
          />
        </div>


        {/* Personal Website */}
        <div>
          
            <label><TbWorldWww color="black" style={{margin: '5px'}} />Website</label>
           
         
          <input
            type="text"
            value={personalWebsite}
            onChange={(e) => setPersonalWebsite(e.target.value)}
            placeholder="Personal Website Name/Title"
          />
        </div>
        </div>
        {/* Hiring Multiple Candidates */}
        <div className="field-row">
  <div style={{ gridColumn: "span 2" }}>
    <div className="label-infoTag-wrapper">
      <label>Hiring Multiple Candidates?</label>
      <span>
        <CiCircleInfo /> Optional
      </span>
    </div>
    <select
      value={hiringMultipleCandidates ? "true" : "false"}
      onChange={(e) => setHiringMultipleCandidates(e.target.value === "true")}
      style={{
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        boxSizing: "border-box"
      }}
    >
      <option value="">Hiring Multiple Candidates?</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
  </div>
</div>


        


        

      <FormControlLabel
        className="newsletter-checkbox"
        onChange={(e) => setNewsLetterSend(e.target.checked)}
       checked={newsLetterSend}
        control={<Checkbox />}
        label="Send Job to Newsletter 📰"
      />
    
  
        <div>
          <button
            style={{ margin: "0 auto" }}
            className="btn"
            type="submit"
            disabled={loading}
          >
            Edit Job 
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobEdit;
