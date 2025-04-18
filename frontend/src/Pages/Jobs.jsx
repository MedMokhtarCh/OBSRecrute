import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearAllJobErrors, fetchJobs, getAllCompanyNames } from '../store/Slices/jobSlice';
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

const Jobs = () => {
  const [filters, setFilters] = useState({
    city: "",
    field: "",
    searchKeyword: "",
    salaryMin: 0,
    jobType: "",
    yearsOfExperience: 0,
    degreeLevel: "",
    companyName: "",
    hiringMultipleCandidates: "",
    showFilters: false,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error, companyNames } = useSelector((state) => state.jobs);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllCompanyNames());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    const { city, field, searchKeyword, salaryMin, companyName, degreeLevel, yearsOfExperience, jobType, hiringMultipleCandidates } = filters;
    dispatch(fetchJobs(
      city, field, searchKeyword, salaryMin, companyName, degreeLevel, yearsOfExperience, jobType, hiringMultipleCandidates || null
    ));
  }, [filters, dispatch]);

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value }));
  };

  const toggleFilters = () => {
    setFilters(prevFilters => ({ ...prevFilters, showFilters: !prevFilters.showFilters }));
  };

  return (
    <section className="jobs">
      {loading ? <Spinner /> : (
        <div>
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={filters.searchKeyword}
              onChange={handleFilterChange}
              name="searchKeyword"
              placeholder="Search for jobs..."
            />
            <CiSearch className="search-icon" onClick={() => dispatch(fetchJobs(filters))} />
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <button
                onClick={toggleFilters}
                className="toggle-filters-btn"
                aria-label={filters.showFilters ? "Hide filters" : "Show filters"}
              >
                {filters.showFilters ? (
                  <><BsFilterSquareFill style={{ marginRight: "0.5rem" }} /> Less filters</>
                ) : (
                  <><BsFilterSquare style={{ marginRight: "0.5rem" }} /> More filters</>
                )}
              </button>
            </div>

            {/* Filter inputs */}
            <div className="filter-group">
              <label>🏢 Company Name</label>
              <select
                value={filters.companyName}
                onChange={handleFilterChange}
                name="companyName"
              >
                <option value="">All Companies</option>
                {(companyNames || []).map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>💰 Minimum Salary</label>
              <select
                value={filters.salaryMin}
                onChange={handleFilterChange}
                name="salaryMin"
              >
                <option value={0}>All Salaries</option>
                <option value={1500}>1,500+</option>
                <option value={2500}>2,500+</option>
              </select>
            </div>

            {/* Additional filters */}
            <div className="filter-group">
              <label>🏙️ City</label>
              <select
                value={filters.city}
                onChange={handleFilterChange}
                name="city"
              >
                <option value="">All Cities</option>
                {cities.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="filter-group">
              <label>📌 Field</label>
              <select
                value={filters.field}
                onChange={handleFilterChange}
                name="field"
              >
                <option value="">All Fields</option>
                {Fields.map((f, i) => <option key={i} value={f}>{f}</option>)}
              </select>
            </div>

            {filters.showFilters && (
              <>
                <div className="filter-group">
                  <label>💼 Contract Type</label>
                  <select
                    value={filters.jobType}
                    onChange={handleFilterChange}
                    name="jobType"
                  >
                    <option value="">All Types</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>⏳ Experience years</label>
                  <select
                    value={filters.yearsOfExperience}
                    onChange={handleFilterChange}
                    name="yearsOfExperience"
                  >
                    <option value={0}>All</option>
                    {[1, 2, 3, 4, 5].map(year => (
                      <option key={year} value={year}>{year}+</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label>🎓 Degree Level</label>
                  <select
                    value={filters.degreeLevel}
                    onChange={handleFilterChange}
                    name="degreeLevel"
                  >
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

          <div className="container">
            <div className="jobs_container">
              {jobs?.length > 0 ? jobs.map(job => (
                <div className="card" key={job._id}>
                  <Link to={`/jobDetails/${job._id}`} className="card-icon"><TbListDetails /></Link>
                  <p className={job.hiringMultipleCandidates ? "hiring-multiple" : "hiring"}>{job.hiringMultipleCandidates ? "Hiring Multiple 👥" : "Hiring One 👤"}</p>
                  <p className="title">{job.title}</p>
                  <p className="company"><MdMapsHomeWork /> {job.companyName}</p>
                  <p className="location"><MdPlace /> {job.location}</p>
                  <p className="salary"><MdAttachMoney /> {job.salary}</p>
                  <p className="posted"><span>Posted:</span> {job.jobPostedOn?.substring(0, 10)}</p>
                  <div className="btn-wrapper">
                    <button className="btn apply-btn" onClick={() => handleApplyClick(job._id)}>Apply Now</button>
                    <Link className="btn details-btn" to={`/jobDetails/${job._id}`}>Details</Link>
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
