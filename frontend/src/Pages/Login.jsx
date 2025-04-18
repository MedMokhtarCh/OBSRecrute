import React, { useEffect, useState } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/Slices/userSlice";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import Swal from "sweetalert2";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error, message, user } = useSelector(
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
        text: error,
        icon: "error",
        confirmButtonText: "Close",
      });
      dispatch(clearAllUserErrors());
    }

    if (isAuthenticated) {
      Swal.fire({
        title: "Connection successful",
        text: `Welcome back! ${user.name}`,
        icon: "success",
        showConfirmButton: false,
        timer: 1600,
      }).then(() => {
        navigateTo("/dashboard");
      });
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Section */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-12 bg-[#E8F4FF]"> {/* Bleu clair */}
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">🔐 Login to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  placeholder="  youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <MdOutlineMailOutline className="absolute top-2.5 right-3 text-gray-400 text-xl" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="pt-2 block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  placeholder="  Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
                <RiLock2Fill className="absolute top-2.5 right-3 text-gray-400 text-xl" />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right mt-4">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 mt-4"
            >
              Login
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-medium hover:underline">
              Register now
            </Link>
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="hidden md:flex w-full md:w-1/2 bg-cover bg-center bg-[url('./assets/RegisterPhoto.jpg')]">
    
      </div>
    </div>
  );
};

export default Login;
