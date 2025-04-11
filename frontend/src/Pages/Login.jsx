import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/Slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error ,message,user} = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
   
    formData.append("email", email);
    formData.append("password", password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (error) {
         Swal.fire({
           title: "Error during connection",
           text: error, // Le message envoyé par le backend
           icon: "error",
           confirmButtonText: "Close",
       
         });
         dispatch(clearAllUserErrors());
       }
     
    if (isAuthenticated) {
      Swal.fire({
        title: "Connection successful",
        text: `Welcome back!  ${user.name}`,
        icon: "success",
        showConfirmButton: false,
        timer: 1600
      }).then(() => {
        navigateTo("/dashboard");
      });
    }
  }, [dispatch, error, loading, isAuthenticated,message]);

  return (
    <>
      <section className="authPage">
        <div className="image-container"></div> {/* Ajouter une image à côté */}
        <div className="container login-container">
          <div className="header">
            <h3>Login to your account</h3> {/* Ajouter un emoji */}
          </div>
          <form onSubmit={handleLogin}>
            <div className="inputTag">
              <label>Email 📧</label> {/* Ajouter un emoji */}
              <div>
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <MdOutlineMailOutline />
              </div>
            </div>
            <div className="inputTag">
              <label>Password 🔒</label> {/* Ajouter un emoji */}
              <div>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <RiLock2Fill />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              Login
            </button>
            <Link to={"/register"}> You do not have an account? Register Now</Link> {/* Ajouter un emoji */}
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
