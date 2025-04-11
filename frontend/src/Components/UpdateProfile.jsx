import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  clearAllUpdateProfileErrors,
  updateProfile,
} from "../store/Slices/updateProfileSlice"
import { getUser } from "../store/Slices/userSlice";
import FieldsArray from "../data/fields";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaBuilding } from "react-icons/fa";
const UpdateProfile = () => {
  const dispatch = useDispatch();
  
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);

  // États locaux avec des valeurs par défaut
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");

  const [firstField, setFirstField] = useState(user?.fieldChoices?.firstChoice || "");
  const [secondField, setSecondField] = useState(user?.fieldChoices?.SecondChoice || "");
  const [thirdField, setThirdField] = useState(user?.fieldChoices?.ThirdChoice || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");


  // Synchroniser les champs lorsque `user` change
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setFirstField(user.fieldChoices?.firstChoice || "");
      setSecondField(user.fieldChoices?.SecondChoice || "");
      setThirdField(user.fieldChoices?.ThirdChoice || "");
      setCompanyName(user.companyName || "");
    }
  }, [user]);

  // Gestion de la mise à jour du profil
  const handleUpdateProfile = () => {
   const userData = {
   
         name,
         email,
         phone,
         address,
    
       };
       
       if (user && user.role === "Job Seeker") {
         userData.firstChoice = firstField;
         userData.SecondChoice = secondField; 
         userData.ThirdChoice = thirdField;  
       }
       
       
       if (user && user.role === "Employer") {
         userData.companyName = companyName;
       }
  
   

    dispatch(updateProfile(userData));
  };

  // Gérer les erreurs et les mises à jour réussies
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

      <div>
        <label> <FaUser color="#04ADE6"  /> Full Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <label> <FaEnvelope color="#04ADE6" /> Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div>
        <label> <FaPhone color="#04ADE6" /> Phone Number</label>
        <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div>
        <label><FaMapMarkerAlt color="#04ADE6"/> Address</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {user?.role && user.role === "Job Seeker" && (
        <div>
          <label> <FaBriefcase color="#04ADE6" /> My Preferred Job Fields</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <select value={firstField} onChange={(e) => setFirstField(e.target.value)}>
              {FieldsArray.map((element, index) => (
                <option value={element} key={index}>{element}</option>
              ))}
            </select>
            <select value={secondField} onChange={(e) => setSecondField(e.target.value)}>
              {FieldsArray.map((element, index) => (
                <option value={element} key={index}>{element}</option>
              ))}
            </select>
            <select value={thirdField} onChange={(e) => setThirdField(e.target.value)}>
              {FieldsArray.map((element, index) => (
                <option value={element} key={index}>{element}</option>
              ))}
            </select>
          </div>
        </div>
      )}

{user?.role && user.role === "Employer" &&  (
         <div>
         <label> <FaBuilding color="#04ADE6"/> Company Name</label>
         <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
       </div>
      )}

<button
  className="save_change_btn_wrapper"
  disabled={loading || !name || !email || !phone}
  onClick={() => {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: "Don't save",
      cancelButtonText: "cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateProfile();
        Swal.fire({
          title: "Saved !",
          text: "Your modifications are saved.",
          icon: "success",
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (result.isDenied) {
        
        Swal.fire({
          title: "Changes are not saved",
          text: "Your modifications have been ignored",
          icon: "error",
          timer: 1600,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }}
>
  Save Changes
</button>

    </div>
  );
};

export default UpdateProfile;
