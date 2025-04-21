import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FaUserEdit } from "react-icons/fa";
import { FaPlus, FaMinus } from "react-icons/fa";
import {
  clearAllUpdateProfileErrors,
  updateProfile,
} from "../store/Slices/updateProfileSlice";
import { getUser } from "../store/Slices/userSlice";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding } from "react-icons/fa";

import '../styles/UpdateProfile.css'
const UpdateProfile = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);

  // States to hold form data
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [companyProfileDescription, setCompanyProfileDescription] = useState(user?.companyProfile?.description || "");
  const [companyProfileSector, setCompanyProfileSector] = useState(user?.companyProfile?.sector || "");
  const [companyProfileLocation, setCompanyProfileLocation] = useState(user?.companyProfile?.location || "");
  const [companyLogo, setcompanyLogo] = useState(user?.companyLogo || null);
  const [imagePreviewlogo, setImagePreviewlogo] = useState(user?.companyLogo?.url || null);
  const [diplomas, setDiplomas] = useState(user?.diplomas || [{ title: "", institution: "", year: "", file: null }]);
  const [certifications, setcertifications] = useState(user?.certifications || [{ title: "", year: "" }]);
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
      setCompanyName(user.companyName || "");
      if (user.companyProfile) {
        setCompanyProfileDescription(user.companyProfile.description || "");
        setCompanyProfileSector(user.companyProfile.sector || "");
        setCompanyProfileLocation(user.companyProfile.location || "");
      }
      setcompanyLogo(user?.companyLogo || null);
      setImagePreviewlogo(user?.companyLogo?.url|| null);
      setDiplomas(user?.diplomas || [{ title: "", institution: "", year: "", file: null }]);
      setcertifications(user?.certifications || [{ title: "", year: ""}]);
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
  
    if (name !== user?.name) formData.append("name", name);
    if (email !== user?.email) formData.append("email", email);
    if (phone !== user?.phone) formData.append("phone", phone);
    if (address !== user?.address) formData.append("address", address);
    if (profilePicture instanceof File) {
      formData.append("profilePicture", profilePicture);
    }
    
    
  
    if (user?.role === "Employer") {
      if (companyName !== user?.companyName) formData.append("companyName", companyName);
      if (companyProfileDescription !== user?.companyProfile?.description)
        formData.append("companyProfile.description", companyProfileDescription);
      if (companyProfileSector !== user?.companyProfile?.sector)
        formData.append("companyProfile.sector", companyProfileSector);
      if (companyProfileLocation !== user?.companyProfile?.location)
        formData.append("companyProfile.location", companyProfileLocation);
  
      if (companyLogo instanceof File) {
        formData.append("companyLogo", companyLogo);
      }
      
    }
  
    if (user?.role === "Job Seeker") {
      const fields = [
        { key: "diplomas", value: diplomas },
        { key: "certifications", value: certifications },
        { key: "technicalSkills", value: technicalSkills },
        { key: "softSkills", value: softSkills },
        { key: "languages", value: languages },
        { key: "education", value: education },
        { key: "experiences", value: experiences },
      ];
  
      fields.forEach(({ key, value }) => {
        const originalValue = JSON.stringify(user?.[key] || []);
        const newValue = JSON.stringify(value);
        if (newValue !== originalValue) {
          formData.append(key, newValue);
        }
      });
    }
  
    if ([...formData.keys()].length === 0) {
      Swal.fire({
        title: "Aucun changement détecté",
        text: "Vous devez modifier au moins un champ avant de soumettre.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
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


  const addCertifications = () => setcertifications([...certifications, { title: "", year: "" }]);
  const removecertifications = (index) => setcertifications(certifications.filter((_, i) => i !== index));
  const handlecertificationsChange = (index, field, value) => {
    const updatedcertifications = certifications.map((cert, i) => 
      i === index ? { ...cert, [field]: value } : cert
    );
   setcertifications(updatedcertifications);
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

  const handlecompanyLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
     setcompanyLogo(file);
      setImagePreviewlogo(URL.createObjectURL(file)); // Preview the image
    }
  };

  // Handle errors and successful update
  useEffect(() => {
     if (error) {
          Swal.fire({
            title: "Error during updating profile",
            text: error,
            icon: "error",
            confirmButtonText: "Close",
          });
          dispatch(clearAllUpdateProfileErrors());
        }
    if (isUpdated) {
      Swal.fire({
              title: "profile updated",
              icon: "success",
              showConfirmButton: false,
              timer: 1600,
            }).then(() => {

              /*navigateTo("/dashboard/update-profile");*/
              dispatch(getUser());
              dispatch(clearAllUpdateProfileErrors());
            });
     
    }
  }, [dispatch, error, isUpdated]);


  return (
    <>
    <div className="account_components">

      <h3>Update Profile</h3>

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
        alt="Aperçu de la photo de profil"
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

    <label
      htmlFor="profilePicture"
      style={{
        position: "absolute",
        bottom: "0",
        right: "0",
        backgroundColor: "#fff",
        borderRadius: "50%",
        padding: "8px",
        cursor: "pointer",
        boxShadow: "0 0 5px rgba(0,0,0,0.3)",
        transform: "translate(10%, 10%)", // Pour un meilleur alignement visuel
      }}
    >
      <FaUserEdit size={18} color="#000" />
    </label>

    <input
      type="file"
      id="profilePicture"
      accept="image/*"
      onChange={handleProfilePictureChange}
      style={{ display: "none" }}
    />
  </div>
</div>



      {/* Basic Information */}
      <div>
        <label ><FaUser /> Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label ><FaEnvelope /> Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label><FaPhone /> Phone Number</label>
        <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <label ><FaMapMarkerAlt /> Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>




      {/* Job Seeker-specific fields */}
      {user?.role === "Job Seeker" && (
       <>
                <div>
               <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Languages</label>
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


<div>
  <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Technical Skills</label>
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
  <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Soft Skills</label>
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
  <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Diplomas</label>
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

 


 <div>
  <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Education</label>
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
    <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Experiences</label>
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



    <div>
  <label style={{ fontSize:"1.5rem" , color:"#04ADE6"}}>Certifications</label>
  {certifications.map((cert, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Title"
        value={certifications.title}
        onChange={(e) => handlecertificationsChange(index, "title", e.target.value)}
      />
      <input
        type="number"
        placeholder="Year"
        value={certifications.year}
        onChange={(e) => handlecertificationsChange(index, "year", e.target.value)}
      />
        <FaMinus onClick={() => removecertifications(index)}/>
    </div>
  ))}
    <FaPlus onClick={addCertifications} />
</div> 

</>  )}





{/* Employer-specific fields */}
{user?.role === "Employer" && (
  <div className="company-profile-section">
    <label><FaBuilding /> Company Information</label>

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
  rows={4} // définit la hauteur
  cols={50} // définit la largeur
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
    {imagePreviewlogo ? (
      <img
        src={imagePreviewlogo}
        alt="Aperçu du logo"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />
    ) : (
      <p>No company logo picture</p>
    )}

    <label
      htmlFor="companyLogo"
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
      type="file"
      id="companyLogo"
      accept="image/*"
      onChange={handlecompanyLogoChange}
      style={{ display: "none" }}
    />
  </div>
</div>


  </div>
)}

      {/* Save Changes Button */}
     


    </div>
    <div className="submit-button-container">
    <button onClick={handleUpdateProfile}>Update Profile</button>
  </div>
   </>
  );
};

export default UpdateProfile;
