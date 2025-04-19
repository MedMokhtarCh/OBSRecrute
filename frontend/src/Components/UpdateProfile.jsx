import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { FaUserEdit } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";

import {
  clearAllUpdateProfileErrors,
  updateProfile,
} from "../store/Slices/updateProfileSlice";
import { getUser } from "../store/Slices/userSlice";
import FieldsArray from "../data/fields";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding } from "react-icons/fa";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);

  // States to hold form data
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [role, setRole] = useState(user?.role || "");
  const [firstField, setFirstField] = useState(user?.fieldChoices?.firstChoice || "");
const [SecondField, setSecondField] = useState(user?.fieldChoices?.SecondChoice || "");

  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [companyProfileDescription, setCompanyProfileDescription] = useState(user?.companyProfile?.description || "");
  const [companyProfileSector, setCompanyProfileSector] = useState(user?.companyProfile?.sector || "");
  const [companyProfileLocation, setCompanyProfileLocation] = useState(user?.companyProfile?.location || "");
  
  const [diplomas, setDiplomas] = useState(user?.diplomas || [{ title: "", institution: "", year: "", file: null }]);
  const [technicalSkills, setTechnicalSkills] = useState(user?.technicalSkills || [""]);
  const [softSkills, setSoftSkills] = useState(user?.softSkills || [""]);
  const [languages, setLanguages] = useState(user?.languages || [{ name: "", level: "" }]);
  
  const [education, setEducation] = useState(user?.education || [{ degree: "", school: "", startYear: "", endYear: "" }]);
  const [experiences, setExperiences] = useState(user?.experiences || [{ jobTitle: "", company: "", description: "", startDate: "", endDate: "" }]);
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || null);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture?.url || null);
  

  // Synchronize fields when the user object changes
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setRole(user.role||"");
      setFirstField(user.fieldChoices?.firstChoice || "");
      setSecondField(user.fieldChoices?.SecondChoice || "");
      setCompanyName(user.companyName || "");
      if (user.companyProfile) {
        setCompanyProfileDescription(user.companyProfile.description || "");
        setCompanyProfileSector(user.companyProfile.sector || "");
        setCompanyProfileLocation(user.companyProfile.location || "");
        

      }
      setDiplomas(user?.diplomas || [{ title: "", institution: "", year: "", file: null }]);
      setTechnicalSkills(user?.technicalSkills || [""]);
      setSoftSkills(user?.softSkills || [""]);
      setLanguages(user?.languages || [{ name: "", level: "" }]);
     
      setEducation(user?.education || [{ degree: "", school: "", startYear: "", endYear: "" }]);
      setExperiences(user?.experiences || [{ jobTitle: "", company: "", description: "", startDate: "", endDate: "" }]);
      setProfilePicture(user?.profilePicture || null);
      setImagePreview(user?.profilePicture?.url|| null);
    }
  }, [user]);

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };
  
  // Handle the profile update
  const handleUpdateProfile = () => {
    const formData = new FormData();
  
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("role", role);
    
    if (profilePicture && profilePicture !== user?.profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

  
    if (user?.role === "Employer") {
      formData.append("companyName", companyName);
      formData.append("companyProfile.description", companyProfileDescription);
      formData.append("companyProfile.sector", companyProfileSector);
      formData.append("companyProfile.location", companyProfileLocation);
    }
  
    if (user?.role === "Job Seeker") {
    formData.append("diplomas", JSON.stringify(diplomas));
    formData.append("technicalSkills", JSON.stringify(technicalSkills));
    formData.append("softSkills", JSON.stringify(softSkills));
    formData.append("languages", JSON.stringify(languages));
    formData.append("education", JSON.stringify(education));
    formData.append("experiences", JSON.stringify(experiences));
    formData.append("firstChoice", firstField);
    formData.append("SecondChoice", SecondField);
  }
    dispatch(updateProfile(formData));
  };
  
const addEducation = () => setEducation([...education, { degree: "", school: "", startYear: "", endYear: "" }]);
const removeEducation = (index) => setEducation(education.filter((_, i) => i !== index));
const handleEducationChange = (index, field, value) => {
  const updatedEducation = education.map((edu, i) =>
    i === index ? { ...edu, [field]: value } : edu
  );
  setEducation(updatedEducation);
};

  const addDiploma = () => setDiplomas([...diplomas, { title: "", institution: "", year: "" }]);
  const removeDiploma = (index) => setDiplomas(diplomas.filter((_, i) => i !== index));
  const handleDiplomaChange = (index, field, value) => {
    const updatedDiplomas = diplomas.map((diploma, i) => 
      i === index ? { ...diploma, [field]: value } : diploma
    );
    setDiplomas(updatedDiplomas);
  };
  const addLanguage = () => setLanguages([...languages, { name: "", level: ""}]);
  const removeLanguage = (index) => setLanguages(languages.filter((_, i) => i !== index));
  const handleLanguageChange = (index, field, value) => {
    const updatedLanguages = languages.map((lang, i) => 
      i === index ? { ...lang, [field]: value } : lang
    );
   setLanguages(updatedLanguages);
  };

  const addTechnicalSkill = () => setTechnicalSkills([...technicalSkills, ""]);

const removeTechnicalSkill = (index) => setTechnicalSkills(
  technicalSkills.filter((_, i) => i !== index)
);

const handleTechnicalSkillChange = (index, value) => {
  const updatedSkills = technicalSkills.map((skill, i) =>
    i === index ? value : skill
  );
  setTechnicalSkills(updatedSkills);
};

  
  const addSoftSkill = () => setSoftSkills([...softSkills, ""]);
  
  const removeSoftSkill = (index) => setSoftSkills(softSkills.filter((_, i) => i !== index));
  
  const handleSoftSkillChange = (index, value) => {
    const updatedSkills = softSkills.map((skill, i) => 
      i === index ? value : skill
    );
    setSoftSkills(updatedSkills);
  };
  

  const addExperience = () => setExperiences([...experiences, { jobTitle: "", company: "", description: "", startDate: "", endDate: "" }]);
  const removeExperience = (index) => setExperiences(experiences.filter((_, i) => i !== index));
  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    setExperiences(updatedExperiences);
  };
  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  

  // Handle errors and successful update
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated.");
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, error, isUpdated]);

  return (
    <div className="account_components">

      <h3>Update Profile</h3>

      {/* Profile Picture Section */}
      <div
  style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  }}
>
  <div
    className="profile-picture-container"
    style={{ position: "relative", display: "inline-block" }}
  >
    {imagePreview ? (
      <img
        src={imagePreview}
        alt="Profile"
        className="profile-picture-preview"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <p>No profile picture</p>
    )}

    {/* Icône d'édition */}
    <label
      htmlFor="profilePictureInput"
      style={{
        position: "absolute",
        bottom: "0",
        right: "0",
        backgroundColor: "#fff",
        borderRadius: "50%",
        padding: "8px",
        cursor: "pointer",
        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
      }}
    >
      <FaUserEdit size={18} color="#000" />
    </label>

    <input
      id="profilePictureInput"
      type="file"
      accept="image/*"
      onChange={handleProfilePictureChange}
      style={{ display: "none" }}
    />
  </div>
</div>

      {/* Basic Information */}
      <div>
        <h3><FaUser /> Full Name</h3>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <h3><FaEnvelope /> Email Address</h3>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <h3><FaPhone /> Phone Number</h3>
        <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <h3><FaMapMarkerAlt /> Address</h3>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {/* Job Seeker-specific fields */}
      {user?.role === "Job Seeker" && (
        <div>
        <div>
        <h3><FaBriefcase /> Preferred Job Fields</h3>
    <div style={{ display: "flex", gap: "10px" }}>
      <select value={firstField} onChange={(e) => setFirstField(e.target.value)}>
        {FieldsArray.map((field, index) => <option key={index} value={field}>{field}</option>)}
      </select>
      <select value={SecondField} onChange={(e) => setSecondField(e.target.value)}>
        {FieldsArray.map((field, index) => <option key={index} value={field}>{field}</option>)}
      </select>
          </div>
          <div>
          <div>

          <div>
  <h3>Languages</h3>
  {languages.map((lang, index) => (
        <div key={index}>
          <label> language number {index + 1} </label>
          <input
            type="text"
            placeholder="Language"
            value={lang.name}
            onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
          />
          <input
            type="text"
           placeholder="Level (e.g. Beginner, Intermediate, Fluent)"
            value={lang.level}
            onChange={(e) => handleLanguageChange(index, 'level', e.target.value)}
          />
          
      
          <FaMinus onClick={() => removeLanguage(index)}/>

        </div>
      ))}
   
      <FaPlus onClick={addLanguage} /> 
     
    </div>


  <h3>Technical Skills</h3>
  {technicalSkills.map((skill, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder={`Skill ${index + 1}`}
        value={skill}
        onChange={(e) => handleTechnicalSkillChange(index, e.target.value)}
      />
   
      <FaMinus onClick={() => removeTechnicalSkill(index)}/>
  
    </div>
  ))}

  <FaPlus onClick={addTechnicalSkill} /> 


 
 

</div>

<div>
  <h3>Soft Skills</h3>
  {softSkills.map((skill, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Skill"
        value={skill}
        onChange={(e) => handleSoftSkillChange(index, e.target.value)}
      />
     
      <FaMinus onClick={() => removeSoftSkill(index)}/>
  
    </div>
  ))}
  
    <FaPlus onClick={addSoftSkill} /> 


  
     
   
</div>

<div>
  <h3>Diplomas</h3>
  {diplomas.map((diploma, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Title"
        value={diploma.title}
        onChange={(e) => handleDiplomaChange(index, "title", e.target.value)}
      />
      <input
        type="text"
        placeholder="Institution"
        value={diploma.institution}
        onChange={(e) => handleDiplomaChange(index, "institution", e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={diploma.year}
        onChange={(e) => handleDiplomaChange(index, "year", e.target.value)}
      />
     
        <FaMinus onClick={() => removeDiploma(index)}/>
    
    </div>
  ))}
 
    <FaPlus onClick={addDiploma} />
 
</div>

 
  <h3>Education</h3>

  {education.map((edu, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Degree"
        value={edu.degree}
        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
      />
      <input
        type="text"
        placeholder="School"
        value={edu.school}
        onChange={(e) => handleEducationChange(index, "school", e.target.value)}
      />
      <input
        type="number"
        placeholder="Start Year"
        value={edu.startYear}
        onChange={(e) => handleEducationChange(index, "startYear", e.target.value)}
      />
      <input
        type="number"
        placeholder="End Year"
        value={edu.endYear}
        onChange={(e) => handleEducationChange(index, "endYear", e.target.value)}
      />
       <FaMinus onClick={() => removeEducation(index)}/>
     
    </div>
  ))}
  
  <FaPlus onClick={addEducation} />
  
</div>

    <div>
    <h3>Experiences</h3>
    {experiences.map((experience, index) => (
  <div key={index}>
    <label>Experience number {index + 1}</label>
    <input
      type="text"
      placeholder="Job Title"
      value={experience.jobTitle}
      onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
    />
    <input
      type="text"
      placeholder="Company"
      value={experience.company}
      onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
    />
    <textarea
      placeholder="Job Description"
      value={experience.description}
      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
    />
    <input
      type="date"
      placeholder="Start Date"
      value={formatDateForInput(experience.startDate)}
      onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
    />
    <input
      type="date"
      placeholder="End Date"
      value={formatDateForInput(experience.endDate)}
      onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
    />
   
    <FaMinus onClick={() => removeExperience(index)}/>
  </div>
))}

     
      <FaPlus onClick={addExperience} />
    </div>
      
 
        </div>
        </div>

      )}

{/* Employer-specific fields */}
{user?.role === "Employer" && (
  <div className="company-profile-section">
    <h3><FaBuilding /> Company Information</h3>

    <div>
      <label>Company Name</label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
    </div>

    <div>
      <label>Description</label>
      <textarea
        value={companyProfileDescription}
        onChange={(e) => setCompanyProfileDescription(e.target.value)}
      />
    </div>

    <div>
      <label>Sector</label>
      <input
        type="text"
        value={companyProfileSector}
        onChange={(e) => setCompanyProfileSector(e.target.value)}
      />
    </div>

    <div>
      <label>Location</label>
      <input
        type="text"
        value={companyProfileLocation}
        onChange={(e) => setCompanyProfileLocation(e.target.value)}
      />
    </div>




  </div>
)}

      {/* Save Changes Button */}
      <button
  onClick={handleUpdateProfile}
  
>
  Update Profile
</button>


    </div>
  );
};

export default UpdateProfile;
