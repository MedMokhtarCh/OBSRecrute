import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import {
  clearAllJobErrors,
  deleteJob,
  getMyJobs,
  resetJobSlice,
} from "../store/Slices/jobSlice";
import Spinner from "./Spinner";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector(
    (state) => state.jobs
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  useEffect(() => {
    dispatch(getMyJobs());

    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteJob(id));
        Swal.fire("Deleted!", "Your job has been deleted.", "success");
      }
    });
  };

  const handleUpdateJob = (id) => {
    if (id){navigateTo(`/dashboard/EditJob/${id}`);}
    
    
  };

  return (
    <div className="account_components">
      <h3>My Jobs</h3>

      {loading ? (
        <Spinner />
      ) : !myJobs ? (
        <h1>Loading jobs...</h1>
      ) : myJobs.length === 0 ? (
        <h1 style={{ fontSize: "1.4rem", fontWeight: "600" }}>
          You have not posted any job!
        </h1>
      ) : (
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Job Field</th>
                <th>Salary</th>
                <th>Location</th>
                <th>Job Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myJobs.map((element) => (
                <tr key={element._id}>
                <td data-label="Job Title">{element.title}</td>
                <td data-label="Job Field">{element.jobField}</td>
                <td data-label="Salary">{element.salary}</td>
                <td data-label="Location">{element.location}</td>
                <td data-label="Job Type">{element.jobType}</td>
                <td className="actions" data-label="Actions">
  <button onClick={() => handleDeleteJob(element._id)}>🗑️ Delete</button>
  <button onClick={() => handleUpdateJob(element._id)}>✏️ Update</button>
  <Link to={`/dashboard/applications-for-job/${element._id}`}>📑 Applications</Link>

  <Link  to={`/dashboard/jobDetails/${element._id}`}>🔍 See job details</Link> {/* ✅ ajouté ici */}
</td>

              </tr>
              
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyJobs;
