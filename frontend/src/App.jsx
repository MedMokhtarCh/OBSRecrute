import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Register from './Pages/Register';
import Jobs from './Pages/Jobs';
import Login from './Pages/Login';
import PostApplication from './Pages/PostApplication';
import NotFound from './Pages/NotFound';
import { useDispatch } from 'react-redux';
import { getUser } from './store/Slices/userSlice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobDetails from './Components/JobDetails';
import JobEdit from './Components/EditJob';
import ApplicationsByJob from './Components/ApplicationsByJob';
import MyProfile from './Components/MyProfile';
import UpdateProfile from './Components/UpdateProfile';
import UpdatePassword from './components/UpdatePassword';
import JobPost from './Components/JobPost'
import MyJobs from './Components/MyJobs';
import Applications from './components/Applications';
import MyApplications from './Components/MyApplications';
import JobDetailsDashboard from './Components/JobdetailsDashboard';

/*import './App.css';*/
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import FavoriteJobs from './Pages/FavoriteJobs';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      <Router>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/favoriteJobs' element={<FavoriteJobs />} />
          <Route path='/post/application/:jobId' element={<PostApplication />} />
          <Route path='/jobDetails/:jobId' element={<JobDetails />} />
          <Route path='/EditJob/:jobId' element={<JobEdit />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
      
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />

          <Route path="*" element={<NotFound />} />

          {/* Dashboard parent route + nested routes */}
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route index element={<Navigate to="profile" />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="update-profile" element={<UpdateProfile />} />
            <Route path="update-password" element={<UpdatePassword/>} />
            <Route path="job-post" element={<JobPost />} />
            <Route path="my-jobs" element={<MyJobs />} />
            <Route path="applications" element={<Applications />} />
            <Route path="my-applications" element={<MyApplications/>} />
            <Route path="applications-for-job/:jobId" element={<ApplicationsByJob />} />
            <Route path="EditJob/:jobId" element={<JobEdit />} />
            <Route path="jobDetails/:jobId" element={<JobDetailsDashboard />} />
          
          </Route>
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </Router>
    </>
  );
};

export default App;
