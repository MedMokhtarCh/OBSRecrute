import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaSun, FaMoon } from "react-icons/fa";
import logo from "../assets/logo1.png";
import { MdFavorite } from "react-icons/md";
import "../styles/Navbar.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState("light");
  const { user, isAuthenticated } = useSelector((state) => state.user);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="logo" />
   
      </div>

      <div className={`links ${show ? "show" : ""}`}>
        <ul>
          <li><Link to="/" onClick={() => setShow(false)}>Home</Link></li>
          {isAuthenticated && user.role === "Job Seeker" && (
  <>
    <li>
      <Link to="/favoriteJobs" onClick={() => setShow(false)} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
        My <MdFavorite color="red" /> Jobs
      </Link>
    </li>

    <li><Link to="/jobs" onClick={() => setShow(false)}>Jobs</Link></li>
  </>
)}


          {isAuthenticated ? (
            <li><Link to="/dashboard" onClick={() => setShow(false)}>Dashboard</Link></li>
          ) : (
            <li><Link to="/login" onClick={() => setShow(false)}>Login</Link></li>
          )}
          <li>
           
          </li>
        </ul>
      </div>

      <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
    </nav>
  );
};

export default Navbar;
