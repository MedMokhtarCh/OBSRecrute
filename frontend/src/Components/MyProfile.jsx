import React from "react";
import { useSelector } from "react-redux";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaBuilding } from "react-icons/fa";

const MyProfile = () => {
 
  const { user } = useSelector((state) => state.user);
  return (
    <div className="account_components">
      <h3>My Profile</h3>
      <div>
      <label> <FaUser color="#04ADE6" /> Full Name </label> 
        <input
          type="text"
          disabled
          value={user && user.name}
          onChange={(e) => e.target.value}
        />
       
      </div>
      <div>
      <label><FaEnvelope color="#04ADE6"  /> Email Address</label>
        <input
          type="email"
          disabled
          value={user && user.email}
          onChange={(e) => e.target.value}
        />
      </div>
      {user && user.role === "Job Seeker" && (
        <div>
          <label><FaBriefcase color="#04ADE6"/> My Preferred Job Fields</label>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              type="text"
              disabled
              value={user && user.fieldChoices.firstChoice}
              onChange={(e) => e.target.value}
            />
            <input
              type="text"
              disabled
              value={user && user.fieldChoices.SecondChoice}
              onChange={(e) => e.target.value}
            />
            <input
              type="text"
              disabled
              value={user && user.fieldChoices.ThirdChoice}
              onChange={(e) => e.target.value}
            />
          </div>
        </div>
      )}

{user && user.role === "Employer" && (
  <div>
  <label><FaBuilding color="#04ADE6" /> Company Name</label>
  <input
    type="text"
    disabled
    value={user && user.companyName
    }
    onChange={(e) => e.target.value}
  />
</div>
)}
      <div>
      <label><FaPhone color="#04ADE6" /> Phone Number</label>
        <input
          type="number"
          disabled
          value={user && user.phone}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
      <label><FaMapMarkerAlt color="#04ADE6" /> Address</label>
        <input
          type="text"
          disabled
          value={user && user.address}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
      <label><FaBriefcase color="#04ADE6" /> Role</label>
        <input
          type="text"
          disabled
          value={user && user.role}
          onChange={(e) => e.target.value}
        />
      </div>
      <div>
      <label><FaCalendarAlt color="#04ADE6" /> Joined On</label>
        <input
          type="text"
          disabled
          value={user && user.createdAt}
          onChange={(e) => e.target.value}
        />
      </div>
    </div>
  );
};

export default MyProfile;