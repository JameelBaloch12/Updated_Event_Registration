import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar1.css';
import logo from '../Assets/logo.png'; // ✅ update with your actual logo filename

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="logo" className="logo-image" />
        Eventify
      </Link>

      <div className="nav-links">
        
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
        <Link to="/tickets">Tickets</Link>
      </div>
    </nav>
  );
}

export default Navbar;
