import React from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaBuilding, FaGraduationCap, FaCertificate, FaLanguage } from "react-icons/fa";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  const renderInput = (label, value, Icon) => {
    if (value !== null && value !== "") {
      return (
        <div>
          <label><Icon color="#04ADE6" /> {label}</label>
          <input
            type="text"
            disabled
            value={value}
            onChange={(e) => e.target.value}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="account_components">
      <h3>My Profile</h3>
      
      {/* Profile Picture Section */}
   
        <div>
          {user?.profilePicture?.url ? (
            <img src={user.profilePicture.url} alt="Profile" />
          ) : (
            <div>
              <span>No Image</span>
            </div>
          )}
        </div>
      {/* Render basic user details */}
      {renderInput("Full Name", user?.name, FaUser)}
      {renderInput("Email Address", user?.email, FaEnvelope)}
      {renderInput("Phone Number", user?.phone, FaPhone)}
      {renderInput("Address", user?.address, FaMapMarkerAlt)}
      {renderInput("Role", user?.role, FaBriefcase)}
      {renderInput("Joined On", new Date(user?.createdAt).toLocaleDateString("fr-FR"), FaCalendarAlt)}


      {/* Render Employer-specific details */}
      {user?.role === "Employer" && renderInput("Company Name", user?.companyName, FaBuilding)}
      
     
      {/* Render diplomas */}
      {user?.diplomas && user.diplomas.length > 0 && (
        <div>
          <label><FaGraduationCap color="#04ADE6" /> Diplomas</label>
          {user.diplomas.map((diploma, index) => (
            <div key={index}>
              <input
                type="text"
                disabled
                value={`${diploma.title} from ${diploma.institution} (${diploma.year})`}
                onChange={(e) => e.target.value}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render technical skills */}
      {user?.technicalSkills && user.technicalSkills.length > 0 && (
        <div>
          <label><FaBriefcase color="#04ADE6" /> Technical Skills</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {user.technicalSkills.map((skill, index) => (
              <input
                key={index}
                type="text"
                disabled
                value={skill}
                onChange={(e) => e.target.value}
              />
            ))}
          </div>
        </div>
      )}

      {/* Render certifications */}
      {user?.certifications && user.certifications.length > 0 && (
        <div>
          <label><FaCertificate color="#04ADE6" /> Certifications</label>
          {user.certifications.map((certification, index) => (
            <div key={index}>
              <input
                type="text"
                disabled
                value={`${certification.title} by ${certification.issuer} (${certification.year})`}
                onChange={(e) => e.target.value}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render education */}
      {user?.education && user.education.length > 0 && (
        <div>
          <label><FaGraduationCap color="#04ADE6" /> Education</label>
          {user.education.map((edu, index) => (
            <div key={index}>
              <input
                type="text"
                disabled
                value={`${edu.degree} at ${edu.school} (${edu.startYear} - ${edu.endYear})`}
                onChange={(e) => e.target.value}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render experiences */}
      {user?.experiences && user.experiences.length > 0 && (
        <div>
          <label><FaBriefcase color="#04ADE6" /> Experiences</label>
          {user.experiences.map((experience, index) => (
            <div key={index}>
              <input
                type="text"
                disabled
                value={`${experience.jobTitle} at ${experience.company} (${new Date(experience.startDate).toLocaleDateString()} - ${new Date(experience.endDate).toLocaleDateString()})`}
                onChange={(e) => e.target.value}
              />
            </div>
          ))}
        </div>
      )}

      {/* Render languages */}
      {user?.languages && user.languages.length > 0 && (
        <div>
          <label><FaLanguage color="#04ADE6" /> Languages</label>
          {user.languages.map((lang, index) => (
            <div key={index}>
              <input
                type="text"
                disabled
                v value={`${lang.name} (${lang.level})`}
                onChange={(e) => e.target.value}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProfile;


