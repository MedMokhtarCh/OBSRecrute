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
import Swal from "sweetalert2";
import FieldsArray from "../data/fields";
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

  const handleRegsiter = (e) => {
    e.preventDefault();
    const userData = {
      role,
      name,
      email,
      phone,
      address,
      password,
     confirmPassword
    };

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
          navigateTo("/dashboard");
        }
      });
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-12 bg-[#E8F4FF]"> {/* Bleu clair */}
      <div className="max-w-md w-full space-y-6">
      <div className="text-center">
  <h2 className="mt-4 text-sm text-gray-600">
    Create a new account 📝
  </h2>
</div>

<form onSubmit={handleRegsiter}>
            {/* Role Selection */}
            <div className="mb-2">
              <label className="mt-4 block text-xs font-medium text-gray-700">
                Register As
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Employer">Employer</option>
                </select>
                <FaRegUser className="absolute top-2 right-3 text-gray-400 text-lg" />
              </div>
            </div>

            {/* Common Fields */}
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <FaPencilAlt className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <MdOutlineMailOutline className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <FaAddressBook className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
            </div>

            {/* Address and Phone */}
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
             
            </div>

            {/* Employer Specific Field */}
            {role === "Employer" && (
              <div>
              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="11-222-333"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <FaPhoneFlip className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700">
                    Company
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your Company Name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                    <ImUserTie className="absolute top-2 right-3 text-gray-400 text-lg" />
                  </div>
                </div>
              </div>
              </div>
            )}

            {/* Job Seeker Specific Fields */}
            {role === "Job Seeker" && (
              <div>
                 <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1">
                 <div>
                <label className="block text-xs font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="11-222-333"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <FaPhoneFlip className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
                </div>
              </div>
            )}

          
            <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <RiLock2Fill className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                  <RiLock2Fill className="absolute top-2 right-3 text-gray-400 text-lg" />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 text-sm rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
              >
                Register
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-full md:w-1/2 bg-cover bg-center bg-[url('./assets/RegisterPhoto.jpg')]"></div>
    </div>
  );
};

export default Register;
