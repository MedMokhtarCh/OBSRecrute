import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/Slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { ImUserTie } from "react-icons/im";
import '../styles/Register.css'

const Register = () => {
  const [role, setRole] = useState("Job Seeker");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const userData = {
      role,
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
    };

    if (role === "Employer") {
      userData.companyName = company;
    }

    dispatch(register(userData));
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Erreur d'inscription",
        text: error,
        icon: "error",
        confirmButtonText: "Fermer",
      });
      dispatch(clearAllUserErrors());
    }

    if (message && isAuthenticated) {
      Swal.fire({
        title: "Inscription réussie 🎉",
        text: message,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        navigateTo("/dashboard");
      });
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <section className="authPagee">
      <div className="form-section">
        <div className="form-box">
         

          <form onSubmit={handleRegister}>
          <div className="form-title">
            <h2>Create account 📝</h2>
          </div>
            <div className="grid-two">
              <div className="form-group">
                <label>Register as</label>
                <div className="input-icon">
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Job Seeker">Candidate</option>
                    <option value="Employer">Employer</option>
                  </select>
                  <FaRegUser className="icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Name</label>
                <div className="input-icon">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FaPencilAlt className="icon" />
                </div>
              </div>
            </div>

            <div className="grid-two">
              <div className="form-group">
                <label>Email</label>
                <div className="input-icon">
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <MdOutlineMailOutline className="icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <div className="input-icon">
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FaAddressBook className="icon" />
                </div>
              </div>
            </div>

            <div className={role === "Employer" ? "grid-two" : "form-group"}>
              <div className="form-group">
                <label>Phone</label>
                <div className="input-icon">
                  <input
                    type="text"
                    placeholder="06 12 34 56 78"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <FaPhoneFlip className="icon" />
                </div>
              </div>

              {role === "Employer" && (
                <div className="form-group">
                  <label>Company</label>
                  <div className="input-icon">
                    <input
                      type="text"
                      placeholder="Company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                    <ImUserTie className="icon" />
                  </div>
                </div>
              )}
            </div>

            <div className="grid-two">
              <div className="form-group">
                <label>Password</label>
                <div className="input-icon">
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <RiLock2Fill className="icon" />
                </div>
              </div>

              <div className="form-group">
                <label>Confirmation</label>
                <div className="input-icon">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <RiLock2Fill className="icon" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" disabled={loading} className="btn-submit">
                Register
              </button>
            </div>

            <p className="text-center">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    
    </section>
  );
};

export default Register;
