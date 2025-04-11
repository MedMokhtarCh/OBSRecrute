import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import Register from './Pages/Register';
import Jobs from './Pages/Jobs';
import Login from './Pages/Login';
import PostApplication from './Pages/PostApplication';
import NotFound from './Pages/NotFound';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './store/Slices/userSlice';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from 'react';
import JobDetails from './Components/JobDetails';
import JobEdit from './Components/EditJob';
import ApplicationsByJob from './Components/ApplicationsByJob';
const App = () => {
  const dispatch=useDispatch();
  useEffect(() => {
  dispatch(getUser());

  }, [])
 
  return (
    <>
      <Router>
     <Navbar/>
        <Routes>
          <Route path='/' element={<Home />} />
         <Route path='/jobs' element={<Jobs />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/post/application/:jobId' element={<PostApplication />} />
          <Route path='/jobDetails/:jobId' element={<JobDetails />} />
          <Route path='/EditJob/:jobId' element={<JobEdit/>} />
          <Route path='/login' element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path='/register' element={<Register />} />
          <Route path="/applications-for-job/:jobId" element={<ApplicationsByJob />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </Router>
    </>
  );
};

export default App;
