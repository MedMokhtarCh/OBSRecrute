import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

// Redux actions
import { clearAllJobErrors } from '../store/Slices/jobSlice';
import { addFavoriteJob, removeFavoriteJob } from "../store/Slices/userSlice";

// UI Components & assets
import Spinner from '../Components/Spinner';
import img from "../assets/Image-not-found.png";

// Icons
import { TbListDetails } from "react-icons/tb";
import { MdMapsHomeWork, MdPlace, MdAttachMoney, MdFavoriteBorder, MdFavorite } from "react-icons/md";

const FavoriteJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
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
      Swal.fire({
        title: 'Remove from favorites?',
        text: "This job will no longer appear in your favorites.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(removeFavoriteJob(jobId));
        }
      });
    } else {
      dispatch(addFavoriteJob(jobId));
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
  }, [error, dispatch]);

  const favoriteJobs = jobs?.filter((job) => favorites.includes(job._id));

  return (
    <section className="jobs">
      {loading ? <Spinner /> : (
        <div className="container">
        
          <h2 className="favorite-title">My Favorite Jobs Selection</h2>
          <div className="jobs_container">
            {favoriteJobs?.length > 0 ? favoriteJobs.map(job => (
              <div className="card" key={job._id}>
                <Link to={`/jobDetails/${job._id}`} className="card-icon"><TbListDetails /></Link>

                <button
                  className="favorite-btn"
                  onClick={() => toggleFavorite(job._id)}
                  title={favorites.includes(job._id) ? "Remove from favorites" : "Add to favorites"}
                >
                  {favorites.includes(job._id)
                    ? <MdFavorite size={30} />
                    : <MdFavoriteBorder size={30} />}
                </button>

                <p className={job.hiringMultipleCandidates ? "hiring-multiple" : "hiring"}>
                  {job.hiringMultipleCandidates ? "Hiring Multiple 👥" : "Hiring One 👤"}
                </p>
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
      )}
    </section>
  );
};

export default FavoriteJobs;
