import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAllJobErrors, fetchJobs, getAllCompanyNames } from '../store/Slices/jobSlice';
import { addFavoriteJob, removeFavoriteJob } from "../store/Slices/userSlice";

import Spinner from '../Components/Spinner';
import { CiSearch } from "react-icons/ci";
import { TbListDetails } from "react-icons/tb";
import { MdMapsHomeWork, MdPlace, MdAttachMoney } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import cities from '../data/cities';
import Fields from '../data/fields';
import img from "../assets/Image-not-found.png";
import { BsFilterSquare, BsFilterSquareFill } from "react-icons/bs";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import debounce from 'lodash.debounce';
import '../styles/jobs.css'; 
const Jobs = () => {
  const [city, setCity] = useState("");
  const [field, setField] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [salaryMin, setMinSalary] = useState(0);
  const [jobType, setContractType] = useState("");
  const [yearsOfExperience, setExperienceLevel] = useState(0);
  const [degreeLevel, setDegreeLevel] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringMultipleCandidates, setHiringMultipleCandidates] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error, companyNames } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const favorites = user?.favorites || [];

  const toggleFavorite = (jobId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must log in to manage favorites!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
      return;
    }

    if (favorites.includes(jobId)) {
      dispatch(removeFavoriteJob(jobId));
    } else {
      dispatch(addFavoriteJob(jobId));
    }
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      dispatch(fetchJobs(
        city,
        field,
        searchKeyword,
        salaryMin,
        companyName,
        degreeLevel,
        yearsOfExperience,
        jobType,
        hiringMultipleCandidates === '' ? null : hiringMultipleCandidates
      ));
    }, 300),
    [city, field, searchKeyword, salaryMin, companyName, degreeLevel, yearsOfExperience, jobType, hiringMultipleCandidates, dispatch]
  );
  useEffect(() => {
    dispatch(getAllCompanyNames());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
  
      dispatch(clearAllJobErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    debouncedSearch();
  }, [debouncedSearch]);


 


  const handleApplyClick = (jobId) => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'You must log in to apply for a job!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Login',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate(`/post/application/${jobId}`);
    }
  };

  return (
    <section className="jobs">
      {loading ? <Spinner /> : (
        <div>
          {/* Search bar */}
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search for jobs..."
            />
            <CiSearch className="search-icon" />
          </div>

          {/* Filters */}
          <div className="filter-bar">
            <div className="filter-group">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="toggle-filters-btn"
                aria-label={showFilters ? "Hide filters" : "Show filters"}
              >
                {showFilters ? (
                  <>
                    <BsFilterSquareFill style={{ marginRight: "0.5rem" }} />
                    Less filters
                  </>
                ) : (
                  <>
                    <BsFilterSquare style={{ marginRight: "0.5rem" }} />
                    More filters
                  </>
                )}
              </button>
            </div>

            {/* Filter controls */}
            <div className="filter-group">
              <label>🏢 Company Name</label>
              <select value={companyName} onChange={(e) => setCompanyName(e.target.value)}>
                <option value="">All Companies</option>
                {(companyNames || []).map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>💰 Minimum Salary</label>
              <select value={salaryMin} onChange={(e) => setMinSalary(Number(e.target.value))}>
                <option value={0}>All Salaries</option>
                <option value={1200}>1200+TND</option>
                <option value={1500}>1500+TND</option>
                <option value={2000}>2000+TND</option>
                <option value={2500}>2500+TND</option>
              </select>
            </div>

            <div className="filter-group">
              <label>👥 Candidates</label>
              <select
                value={hiringMultipleCandidates}
                onChange={(e) => {
                  const val = e.target.value;
                  setHiringMultipleCandidates(val === "" ? "" : val === "true");
                }}
              >
                <option value="">All</option>
                <option value="true">Multiple</option>
                <option value="false">One</option>
              </select>
            </div>

            <div className="filter-group">
              <label>🏙️ City</label>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="">All Cities</option>
                {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>📌 Field</label>
              <select value={field} onChange={(e) => setField(e.target.value)}>
                <option value="">All Fields</option>
                {Fields.map((f, i) => <option key={i} value={f}>{f}</option>)}
              </select>
            </div>

            {showFilters && (
              <>
                <div className="filter-group">
                  <label>💼 Contract Type</label>
                  <select value={jobType} onChange={(e) => setContractType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>⏳ Experience Years</label>
                  <select value={yearsOfExperience} onChange={(e) => setExperienceLevel(Number(e.target.value))}>
                    <option value={0}>All</option>
                    {[1, 2, 3, 4, 5].map(year => (
                      <option key={year} value={year}>{year}+</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>🎓 Degree Level</label>
                  <select value={degreeLevel} onChange={(e) => setDegreeLevel(e.target.value)}>
                    <option value="">All Levels</option>
                    <option value="Bachelor's">Bachelor's</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Jobs listing */}
          <div >
            <div className="jobs_container">
              {jobs?.length > 0 ? jobs.map(job => (
               <div 
               key={job._id} 
               className="card" 
               onClick={() => navigate(`/jobDetails/${job._id}`)} 
               style={{ cursor: 'pointer' }} // Ajoute un style pour rendre le div interactif comme un lien
             >
               <div
                 className="favorite-btn"
                 onClick={(e) => {
                   e.stopPropagation();
                   toggleFavorite(job._id);
                 }}
                 title={favorites.includes(job._id) ? "Remove from favorites" : "Add to favorites"}
               >
                 {favorites.includes(job._id) ? (
                   <MdFavorite size={30} />
                 ) : (
                   <MdFavoriteBorder size={30} />
                 )}
               </div>
             
               <p className={job.hiringMultipleCandidates ? "hiring-multiple" : "hiring"}>
                 {job.hiringMultipleCandidates ? "Hiring Multiple 👥" : "Hiring One 👤"}
               </p>
               <p className="title">{job.title}</p>
               <p className="company"><MdMapsHomeWork /> {job.companyName}</p>
               <p className="location"><MdPlace /> {job.location}</p>
               <p className="salary"><MdAttachMoney /> {job.salary}</p>
               <p className="posted"><span>Posted:</span> {job.jobPostedOn?.substring(0, 10)}</p>
               <div className="btn-wrapper">
                 <button
                   className="btn apply-btn"
                   onClick={(e) => {
                     e.stopPropagation();
                     handleApplyClick(job._id);
                   }}
                 >
                   Apply Now
                 </button>
               </div>
             </div>
             
              )) : (
                <img src={img} alt="Not Found" style={{ width: '100%' }} />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Jobs;
