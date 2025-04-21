import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors } from "../store/Slices/userSlice";
import { MdLogout , MdOutlineWork} from "react-icons/md";
import { FaUserCog, FaHome, FaTachometerAlt, FaBox, FaUsers, FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdPostAdd } from "react-icons/md";
import Swal from "sweetalert2";
import '../styles/Dashboard.css';
import { FaBars } from "react-icons/fa";
const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        Swal.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          showConfirmButton: false,
          timer: 1800
        });
      }
    });
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated]);

  const handleLinkClick = () => {
    if (collapsed) setCollapsed(false);
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
        <FaBars onClick={() => setCollapsed(!collapsed)} className="toggle-btn"/>
        
          {!collapsed && <h3></h3>}
        </div>
        <ul className="sidebar-links">
          <li>
            <Link to="/dashboard/profile" onClick={handleLinkClick}>
              <FaUserCircle />
              {!collapsed && " My Profile"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/update-profile" onClick={handleLinkClick}>
              <FaUserCog />
              {!collapsed && " Update Profile"}
            </Link>
          </li>
          <li>
            <Link to="/dashboard/update-password" onClick={handleLinkClick}>
            <RiLockPasswordFill />  {!collapsed && "Update Password"}
            </Link>
          </li>

          {user?.role === "Employer" && (
            <>
              <li>
                <Link to="/dashboard/job-post" onClick={handleLinkClick}>
                <MdPostAdd />   {!collapsed && "Post New Job"}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-jobs" onClick={handleLinkClick}>
                <MdOutlineWork /> {!collapsed && "My Jobs"}
                </Link>
              </li>
              <li>
                <Link to="/dashboard/applications" onClick={handleLinkClick}>
                <SlEnvolopeLetter />   {!collapsed && "Applications"}
                </Link>
              </li>
            </>
          )}

          {user?.role === "Job Seeker" && (
            <li>
              <Link to="/dashboard/my-applications" onClick={handleLinkClick}>
              <SlEnvolopeLetter />    {!collapsed && "My Applications"}
              </Link>
            </li>
          )}
        </ul>

        <div className="sidebar-footer">
  {user?.profilePicture?.url ? (
    <img
      src={user.profilePicture.url}
      alt="Profile"
      className="sidebar-avatar"
      style={{ width: "40px", height: "40px", borderRadius: "50%" }}
    />
  ) : (
    <div
      className="sidebar-avatar"
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#ccc", // fallback color if no profile picture
      }}
    ></div>
  )}
  
  {!collapsed && <span>{user?.name || "User"}</span>}
</div>

      </aside>

      <main className="main-content">
        <div className="component_header">
      
          <p>
            Welcome! <span>{user && user.name}</span>
          </p>
          <div className="icons">
           
            <button onClick={handleLogout}>
              <MdLogout /> Logout
            </button>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;
