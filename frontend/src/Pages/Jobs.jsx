import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAllJobErrors, fetchJobs } from '../store/Slices/jobSlice';
import Spinner from '../Components/Spinner';
import { CiSearch } from "react-icons/ci";
import { TbListDetails } from "react-icons/tb";
import { MdMapsHomeWork , MdPlace , MdAttachMoney} from "react-icons/md"; 
import { Link } from 'react-router-dom'; 
import cities from '../data/cities';
import Fields from '../data/fields';
import img from "../assets/Image-not-found.png";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleCityChange = (selected) => {
    setCity(city === selected ? "" : selected);
    setSelectedCity(selectedCity === selected ? "" : selected);
  };

  const handleNicheChange = (selected) => {
    setNiche(niche === selected ? "" : selected);
    setSelectedNiche(selectedNiche === selected ? "" : selected);
  };


  const handleApplyClick = (jobId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must log in to apply for a job!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Login Now'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate(`/post/application/${jobId}`);
    }
  };
  

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]);

  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const filterContainer = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    backgroundColor: "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const jobCard = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "1.5rem",
    marginBottom: "15px",
  };

  const buttonStyle = {
    backgroundColor: "#04ADE6", 
    color: "#fff", 
    padding: "12px 20px",  
    borderRadius: "12px",  
    textDecoration: "none",  
    fontWeight: "600",  
    fontSize: "16px",  
    display: "inline-block",  
    textAlign: "center",  
    cursor: "pointer",  
    transition: "all 0.3s ease",  
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for jobs..."
            />
            <CiSearch className="search-icon" onClick={handleSearch} />
          </div>
          <div className="wrapper">
            <div className="filter-bar" style={filterContainer}>
              <div className="cities">
                <h2>🏙️ Filter by City</h2>
                {cities.map((city, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city}
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              <div className="cities">
                <h2>📌 Filter by Field</h2>
                {Fields.map((niche, index) => (
                  <div key={index}>
                    <input
                      type="checkbox"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Filter By City</option>
                  <option value="All">All</option>
                  {cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>
                <select value={niche} onChange={(e) => setNiche(e.target.value)}>
                  <option value="">Filter By Field</option>
                  {Fields.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>
              <div className="jobs_container">
                {jobs && jobs.length > 0 ? (
                  jobs.map((element) => (
                    <div className="card" key={element._id} style={jobCard}>
                       <Link
                          to={`/jobDetails/${element._id}`}
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            fontSize: "20px",
                            color: "#010101",
                          }}
                        >
                          <TbListDetails />
                        </Link>
                      {element.hiringMultipleCandidates ? (
                        <p className="hiring-multiple">Hiring Multiple Candidates 👩‍💼👨‍💼👩‍💼</p>
                      ) : (
                        <p className="hiring">Hiring one candidate👨‍💼</p>
                      )}
                      <p className="title">{element.title}</p>
                      <p className="company">
                        <MdMapsHomeWork color='#010101' /> {element.companyName}
                      </p>
                      <p className="location">
                        <MdPlace color='#010101' /> {element.location}
                      </p>
                      <p className="salary">
                        <MdAttachMoney color='#010101' /> {element.salary}
                      </p>
                      <p className="posted">
                        <span style={{ fontSize: "16px" }}>Posted on:</span>
                        {element.jobPostedOn.substring(0, 10)}
                      </p>

                      <div className="btn-wrapper">
                      <button
  className="btn"
  style={buttonStyle}
  onClick={() => handleApplyClick(element._id)}
>
  📨 Apply Now
</button>

                        <Link
                          className="btn"
                          style={{ ...buttonStyle, backgroundColor: "#b1dca0" }}
                          to={`/jobDetails/${element._id}`}
                        >
                          🔍 See details
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <img src={img} alt="job-not-found" style={{ width: "100%" }} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
