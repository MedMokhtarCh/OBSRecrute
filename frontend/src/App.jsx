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

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/jobs' element={<Jobs />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/post/application/:jobId' element={<PostApplication />} />
          <Route path='/login' element={<Login />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
