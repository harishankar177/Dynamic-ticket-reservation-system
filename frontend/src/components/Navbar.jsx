import React from "react";
import { Link } from "react-router-dom";
import { FaTrain, FaHome, FaInfoCircle, FaServicestack, FaEnvelope } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left side - Train Icon */}
      <div className="navbar-logo">
        <FaTrain className="train-icon" />
        <span className="brand-name">Railway</span>
      </div>

      {/* Right side - Links with Icons */}
      <ul className="navbar-links">
        <li>
          <Link to="/"><FaHome /> Home</Link>
        </li>
        <li>
          <Link to="/about"><FaInfoCircle /> About</Link>
        </li>
        <li>
          <Link to="/services"><FaServicestack /> Services</Link>
        </li>
        <li>
          <Link to="/contact"><FaEnvelope /> Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
