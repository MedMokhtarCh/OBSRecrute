import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/Slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import Swal from "sweetalert2";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);
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
        title: "Erreur de connexion",
        text: error,
        icon: "error",
        confirmButtonText: "Fermer",
      });
      dispatch(clearAllUserErrors());
    }

    if (isAuthenticated) {
      Swal.fire({
        title: "Connexion réussie",
        text: `Bienvenue ${user?.name || ""} 👋`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      }).then(() => {
        navigateTo("/dashboard");
      });
    }
  }, [dispatch, error, isAuthenticated, user]);

  return (
    <section className="authPage">
      <div className="image-container"></div>
      <div className="container login-container">
        
        <form onSubmit={handleLogin}>
        <div className="header">
          <h3>🔐 Connexion</h3>
        </div>
      
          <div className="inputTag">
            <label>Email 📧</label>
            <div>
            <input
  type="Email"
  placeholder="Your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
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
          
          <div className="inputTag">
            <label>Password🔒</label>
            <div>
              <input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  border: "none", 
                  borderBottom: "1px solid #ccc", 
                  outline: "none", 
                  backgroundColor: "transparent" 
                }}
              />
              <RiLock2Fill />
            </div>
          </div>

          <div className="link-container">
            <Link to="/forgot-password"> Forgot your password?</Link>
          </div>

          <button type="submit" disabled={loading}>
            Login
          </button>

          <div className="link-containerRegister">
            <Link to="/register"> Don’t have an account?{" "}
          
              Register now
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
