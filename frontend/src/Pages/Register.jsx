import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/Slices/userSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { ImUserTie } from "react-icons/im";
import FieldsArray from "../data/fields";
import Swal from "sweetalert2";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstField, setFirstField] = useState("");
  const [secondField, setSecondField] = useState("");
  const [thirdField, setThirdField] = useState("");
  const [company, setCompany] = useState("");

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegsiter = (e) => {
    e.preventDefault();
    const userData = {
      role,
      name,
      email,
      phone,
      address,
      password,
    };

    if (role === "Job Seeker") {
      userData.firstChoice = firstField;
      userData.SecondChoice = secondField;
      userData.ThirdChoice = thirdField;
    }

    if (role === "Employer") {
      userData.companyName = company;
    }

    dispatch(register(userData));
  };

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: "Error during registration",
        text: error, // Le message envoyé par le backend
        icon: "error",
        confirmButtonText: "Close",
    
      });
      dispatch(clearAllUserErrors());
    }
  
    if (message) {
      Swal.fire({
        title: "Registration successful!",
        position: "top-end",
        text: message,
        icon: "success",
        showConfirmButton: false,
        timer: 1300
      }).then(() => {
        if (isAuthenticated) {
          navigateTo("/jobs");
        }
      });
    }
  }, [dispatch, error, loading, isAuthenticated, message]);
  

  return (
    <>
      <ToastContainer />
      <section className="authPage">
        <div className="container">
          <div className="header">
            <h3>Create a new account 📝</h3>
          </div>
          <form onSubmit={handleRegsiter}>
            <div className="wrapper">
              <div className="inputTag">
                <label>Register As</label>
                <div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>Select Role</option>
                    <option value="Employer">Register as an Employer 👔</option>
                    <option value="Job Seeker">Register as a Job Seeker 💼</option>
                  </select>
                  <FaRegUser />
                </div>
              </div>
              <div className="inputTag">
                <label>Name </label>
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <FaPencilAlt />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Email Address </label>
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
                <label>Phone Number </label>
                <div>
                  <input
                    type="number"
                    placeholder="111-222-333"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <FaPhoneFlip />
                </div>
              </div>
            </div>
            <div className="wrapper">
              <div className="inputTag">
                <label>Address </label>
                <div>
                  <input
                    type="text"
                    placeholder="Your Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <FaAddressBook />
                </div>
              </div>
              {role === "Employer" && (
                <div className="inputTag">
                  <label>Company </label>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                    <ImUserTie />
                  </div>
                </div>
              )}
            </div>

            {role === "Job Seeker" && (
              <>
                <div className="wrapper">
                  <div className="inputTag">
                    <label>Your First Field</label>
                    <div>
                      <select
                        value={firstField}
                        onChange={(e) => setFirstField(e.target.value)}
                      >
                        <option value="" disabled style={{ color: "#999" }}>
                          Your Field
                        </option>
                        {FieldsArray.map((field, index) => (
                          <option key={index} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your Second Field </label>
                    <div>
                      <select
                        value={secondField}
                        onChange={(e) => setSecondField(e.target.value)}
                      >
                        <option value="" disabled style={{ color: "#999" }}>
                          Your Field
                        </option>
                        {FieldsArray.map((field, index) => (
                          <option key={index} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                  <div className="inputTag">
                    <label>Your Third Field </label>
                    <div>
                      <select
                        value={thirdField}
                        onChange={(e) => setThirdField(e.target.value)}
                      >
                        <option value="" disabled style={{ color: "#999" }}>
                          Your Field
                        </option>
                        {FieldsArray.map((field, index) => (
                          <option key={index} value={field}>
                            {field}
                          </option>
                        ))}
                      </select>
                      <MdCategory />
                    </div>
                  </div>
                </div>
              </>
            )}
            <div className="wrapper">
              <div className="inputTag">
                <label>Password </label>
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
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
            <Link to="/login" className="loginLink">
              Already have an account? Login 🔑
            </Link>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
