import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAllUpdateProfileErrors, clearResetPasswordSuccess } from "../store/Slices/updateProfileSlice";

import { useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoArrowBackOutline } from "react-icons/io5";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
   const navigateTo = useNavigate();
  const { resetPasswordSuccess, resetPasswordError } = useSelector((state) => state.updateProfile);
const { user} = useSelector(
    (state) => state.user
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match!", "error");
      return;
    }

    dispatch(
      resetPassword({
        email,
        otp,
        newPassword,
        confirmPassword
      })
    );
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (resetPasswordSuccess) {
      Swal.fire({
        title: "Connection successful",
        text: `Welcome back! ${user.name}`,
        icon: "success",
        showConfirmButton: false,
        timer: 1600
      }).then(() => {
        navigateTo("/dashboard");
      });
    }
  
    if (resetPasswordError) {
      Swal.fire("Error", resetPasswordError, "error");
      dispatch(clearAllUpdateProfileErrors());
    }
  
    return () => {
      // ✅ nettoyage important ici
      dispatch(clearResetPasswordSuccess());
    };
  }, [resetPasswordSuccess, resetPasswordError, dispatch, navigateTo]);
  
  

  return (
    <section className="authPage">
      <div className="container">
         {/* HEADER */}
              <IoArrowBackOutline color="black" size={24} onClick={() => {
                navigateTo("/forgot-password")}
               } />
        <div className="header">
          <h3>Reset Your Password</h3>
        </div>
        <form onSubmit={handleSubmit}>
         <div className="inputTag">
                                <label>Email : </label>
                                <div>
                                  <input
                                    type="email"
                                    placeholder="youremail@gmail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ 
                                      border: "none", 
                                      borderBottom: "1px solid #ccc", 
                                      outline: "none", 
                                      backgroundColor: "transparent" 
                                    }}
                                  />
                                  <MdOutlineMailOutline/>
                                </div>
                              </div>
          <div className="inputTag">
        
          <label>Code :</label>
          <div>
            <input
              type="text"
              value={otp}
              required
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter code"
              style={{ 
                border: "none", 
                borderBottom: "1px solid #ccc", 
                outline: "none", 
                backgroundColor: "transparent" 
              }}
            />
           <RiLockPasswordLine />
          </div>             
                                    
                                  </div>
                               
           
          <div className="inputTag">
            <label>New Password :</label>
            <div>
            <input
              type="password"
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              style={{ 
                border: "none", 
                borderBottom: "1px solid #ccc", 
                outline: "none", 
                backgroundColor: "transparent" 
              }}
            />
             <RiLockPasswordLine />
            </div>
          </div>
          <div className="inputTag">
            <label>Confirm Password :</label>
            <div>
            <input
              type="password"
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              style={{ 
                border: "none", 
                borderBottom: "1px solid #ccc", 
                outline: "none", 
                backgroundColor: "transparent" 
              }}
            />
             <RiLockPasswordLine />
             </div>
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
