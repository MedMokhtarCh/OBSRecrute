import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearAllUpdateProfileErrors } from "../store/Slices/updateProfileSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoArrowBackOutline } from "react-icons/io5";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
   const navigateTo = useNavigate();
  const navigate = useNavigate();
  const { forgotPasswordSuccess, forgotPasswordError } = useSelector((state) => state.updateProfile);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (forgotPasswordSuccess) {
      Swal.fire("Success", forgotPasswordSuccess, "success").then(() => {
        navigate("/reset-password");
      });
    }
    if (forgotPasswordError) {
      Swal.fire("Error", forgotPasswordError, "error");
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [forgotPasswordSuccess, forgotPasswordError, dispatch, navigate]);

  return (
    <section className="authPage">
      <div className="container">
         {/* HEADER */}
                      <IoArrowBackOutline color="black" size={24} onClick={() => {
                        navigateTo("/login")}
                       } />
        <div className="header">
          <h3>Enter your email to reset password</h3>
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
                         <MdOutlineMailOutline />
                       </div>
                     </div>
          <button type="submit">Send OTP</button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
