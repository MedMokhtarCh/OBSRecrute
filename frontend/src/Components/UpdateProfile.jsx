import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
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
  const [secondField, setSecondField] = useState(user?.fieldChoices?.SecondChoice || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [companyProfileDescription, setCompanyProfileDescription] = useState(user?.companyProfile?.description || "");
  const [companyProfileSector, setCompanyProfileSector] = useState(user?.companyProfile?.sector || "");
  const [companyProfileLocation, setCompanyProfileLocation] = useState(user?.companyProfile?.location || "");

  const [diplomas, setDiplomas] = useState(user?.diplomas || [{ title: "", institution: "", year: "", file: null }]);
  const [technicalSkills, setTechnicalSkills] = useState(user?.technicalSkills || [""]);
  const [softSkills, setSoftSkills] = useState(user?.softSkills || [""]);
  const [languages, setLanguages] = useState(user?.languages || [{ name: "", level: "" }]);
  const [certifications, setCertifications] = useState(user?.certifications || [{ title: "", issuer: "", year: "" }]);
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
      setCertifications(user?.certifications || [{ title: "", issuer: "", year: "" }]);
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
    const userData = {
      name,
      email,
      phone,
      address,
      profilePicture,
      role,
      fieldChoices: {
        firstChoice: firstField,
        secondChoice: secondField,
      },
      diplomas,
      technicalSkills,
      softSkills,
      languages,
      certifications,
      education,
      experiences,
    };

    if (user?.role === "Employer") {
      userData.companyName = companyName;
      userData.companyProfile = {
        description: companyProfileDescription,
        sector: companyProfileSector,
        location: companyProfileLocation,
      };
    }

    dispatch(updateProfile(userData));
  };


  const addCertification = () => setCertifications([...certifications, { title: "", issuer: "", year: "" }]);
const removeCertification = (index) => setCertifications(certifications.filter((_, i) => i !== index));
const handleCertificationChange = (index, field, value) => {
  const updatedCertifications = certifications.map((cert, i) =>
    i === index ? { ...cert, [field]: value } : cert
  );
  setCertifications(updatedCertifications);
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

  // Handle profile picture removal
  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setImagePreview(null); // Reset preview
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
    <div className="update-profile">
      <h3>Update Profile</h3>

      {/* Profile Picture Section */}
      <div>
       
        <div className="profile-picture-container">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="profile-picture-preview" />
          ) : (
            <p>No profile picture</p>
          )}
          <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
          
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
            <select value={secondField} onChange={(e) => setSecondField(e.target.value)}>
              {FieldsArray.map((field, index) => <option key={index} value={field}>{field}</option>)}
            </select>
          </div>
          <div>
  <h3>Technical Skills</h3>

  {technicalSkills.map((skill, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder={`Skill ${index + 1}`}
        value={skill}
        onChange={(e) => handleTechnicalSkillChange(index, e.target.value)}
      />
      <button type="button" onClick={() => removeTechnicalSkill(index)}>
        Remove
      </button>
    </div>
  ))}

  <button type="button" onClick={addTechnicalSkill}>
    Add Technical Skill
  </button>
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
      <button type="button" onClick={() => removeSoftSkill(index)}>
        Remove
      </button>
    </div>
  ))}
  
  <button type="button" onClick={addSoftSkill}>
    Add Soft Skill
  </button>
</div>

<div>
  <h3>Education</h3>
  {education.map((item, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Degree"
        value={item.degree}
        onChange={(e) => {
          const updated = [...education];
          updated[index].degree = e.target.value;
          setEducation(updated);
        }}
      />
      <input
        type="text"
        placeholder="School"
        value={item.school}
        onChange={(e) => {
          const updated = [...education];
          updated[index].school = e.target.value;
          setEducation(updated);
        }}
      />
      <input
        type="text"
        placeholder="Start Year"
        value={item.startYear}
        onChange={(e) => {
          const updated = [...education];
          updated[index].startYear = e.target.value;
          setEducation(updated);
        }}
      />
      <input
        type="text"
        placeholder="End Year"
        value={item.endYear}
        onChange={(e) => {
          const updated = [...education];
          updated[index].endYear = e.target.value;
          setEducation(updated);
        }}
      />
      <button type="button" onClick={() => setEducation(education.filter((_, i) => i !== index))}>
        Remove
      </button>
    </div>
  ))}
  <button type="button" onClick={() => setEducation([...education, { degree: "", school: "", startYear: "", endYear: "" }])}>Add Education</button>
</div>

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
          
          <button type="button" onClick={() => removeLanguage(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addLanguage}>
        Add language
      </button>
    </div>

<div>
  <h3>Certifications</h3>
  {certifications.map((cert, index) => (
    <div key={index}>
      <input
        type="text"
        placeholder="Title"
        value={cert.title}
        onChange={(e) => {
          const updated = [...certifications];
          updated[index].title = e.target.value;
          setCertifications(updated);
        }}
      />
      <input
        type="text"
        placeholder="Issuer"
        value={cert.issuer}
        onChange={(e) => {
          const updated = [...certifications];
          updated[index].issuer = e.target.value;
          setCertifications(updated);
        }}
      />
      <input
        type="text"
        placeholder="Year"
        value={cert.year}
        onChange={(e) => {
          const updated = [...certifications];
          updated[index].year = e.target.value;
          setCertifications(updated);
        }}
      />
      <button type="button" onClick={() => setCertifications(certifications.filter((_, i) => i !== index))}>
        Remove
      </button>
    </div>
  ))}
  <button type="button" onClick={() => setCertifications([...certifications, { title: "", issuer: "", year: "" }])}>Add Certification</button>
</div>


<div>
      <h3>Diplomas</h3>
      {diplomas.map((diploma, index) => (
        <div key={index}>
          <label> Diploma number {index + 1} </label>
          <input
            type="text"
            placeholder="Title"
            value={diploma.title}
            onChange={(e) => handleDiplomaChange(index, 'title', e.target.value)}
          />
          <input
            type="text"
            placeholder="Institution"
            value={diploma.institution}
            onChange={(e) => handleDiplomaChange(index, 'institution', e.target.value)}
          />
          <input
            type="number"
            placeholder="Year"
            value={diploma.year}
            onChange={(e) => handleDiplomaChange(index, 'year', e.target.value)}
          />
          
          <button type="button" onClick={() => removeDiploma(index)}>
            Remove
          </button>
        </div>
      ))}
      <button type="button" onClick={addDiploma}>
        Add Diploma
      </button>
    </div>

    <div>
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
      <button type="button" onClick={() => removeEducation(index)}>
        Remove
      </button>
    </div>
  ))}
  
  <button type="button" onClick={addEducation}>
    Add Education
  </button>
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
    <button type="button" onClick={() => removeExperience(index)}>Remove</button>
  </div>
))}

      <button type="button" onClick={addExperience}>Add Experience</button>
    </div>
      

        </div>
        </div>

      )}

{/* Employer-specific fields */}
{user?.role === "Employer" && (
        <div>
          <h3><FaBuilding /> Company Profile</h3>
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <textarea
            placeholder="Company Description"
            value={companyProfileDescription}
            onChange={(e) => setCompanyProfileDescription(e.target.value)}
          />
        </div>  )}
      {/* Save Changes Button */}
      <button
  onClick={handleUpdateProfile}
  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded mt-4"
>
  Update Profile
</button>


    </div>
  );
};

export default UpdateProfile;
