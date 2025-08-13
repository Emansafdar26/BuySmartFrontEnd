
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsCart3, BsPersonCircle, BsSearch } from "react-icons/bs";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { isAuthenticated } from '../lib/auth'
import "../Styles/MainHeader.css";

const MainHeader = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate()
  const route = useLocation()

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  const searchResults = (event) => {
    if (event.keyCode === 13) {
       onSearch(route.pathname)
    }
  }


  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo-container">
          <div className="brand">
            <BsCart3 className="brand-icon" />
            <span className="brand-name">BUYSMART</span>
          </div>
        </Link>

        <div className="search-container">
          <BsSearch className="search-icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyUp={searchResults}
          />
        </div>

        <div className="profile-section" ref={dropdownRef}>
          <div className="profile-icon" onClick={toggleDropdown}>
            <BsPersonCircle size={30} />
          </div>

    {dropdownOpen && (
      isAuthenticated() ? <div className="dropdown-menu">
      <Link to="/Profile" className="dropdown-item">Profile</Link>
      <a onClick={logout} className="dropdown-item" role="button"> Logout </a>
    </div> : <div className="dropdown-menu">
      <Link to="/Login" className="dropdown-item">Login</Link>
      <Link to="/SignUp" className="dropdown-item">Sign Up</Link>
    </div>
    )}
  </div>
</div>
</header>
  );
};

export default MainHeader;
