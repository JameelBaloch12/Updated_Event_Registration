import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/User/Navbar';
import Home from './Components/User/Home';
import About from './Components/User/About';
import Login from './Components/User/Login';
import EventRegistration from './Components/User/EventRegistration';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Register from './Components/User/Register';
import Tickets from './Components/User/Tickets';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/eventregistration"element={<EventRegistration/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/tickets" element={<Tickets/>}/>
      </Routes>
    </Router>
  );
}

export default App;
