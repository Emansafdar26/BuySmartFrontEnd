import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BsCart3, BsSearch, BsPersonCircle } from "react-icons/bs";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { isAuthenticated } from "../lib/auth";
import { NavLink } from "react-router-dom";
import "../Styles/Navbar.css";
import CategoryDropdown from "./CategoryDropdown";
import "../Styles/MainHeader.css";

const MainHeader = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const route = useLocation();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  // 👇 Instead of logging out directly, open confirmation modal
  const handleLogoutClick = () => {
    setShowConfirmModal(true);
  };

  // 👇 When user confirms
  const confirmLogout = () => {
    setShowConfirmModal(false);
    localStorage.clear();
    setShowLogoutModal(true); // show success modal
    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/"); // redirect home
    }, 2000);
  };

  const searchResults = (event) => {
    if (event.keyCode === 13) onSearch(route.pathname);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".categories-menu")) {
        setShowCategories(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  const user = isAuthenticated()
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userInitial = user ? user.name.charAt(0).toUpperCase() : "";

  return (
    <>
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo-container">
            <div className="brand">
              <BsCart3 className="brand-icon" />
              <span className="brand-name">BUYSMART</span>
            </div>
          </Link>

          <nav className="navbar">
            <ul className="nav-links">
              <li>
                <NavLink exact="true" to="/" activeclassname="active">
                  Home
                </NavLink>
              </li>
              <li className="categories-menu">
                <NavLink
                  to="/categories"
                  className={({ isActive }) => (isActive ? "active" : "")}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCategories((prev) => !prev);
                  }}
                >
                  Categories
                </NavLink>
                {showCategories && <CategoryDropdown />}
              </li>

              <li>
                <NavLink to="/Products" activeclassname="active">
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/favourites" activeclassname="active">
                  Favourites
                </NavLink>
              </li>
              <li>
                <NavLink to="/price-alerts" activeclassname="active">
                  Price Alerts
                </NavLink>
              </li>
            </ul>
          </nav>

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
            {user ? (
              <div className="user-badge" onClick={toggleDropdown}>
                <div className="user-initial">{userInitial}</div>
              </div>
            ) : (
              <div className="profile-icon" onClick={toggleDropdown}>
                <BsPersonCircle size={30} />
              </div>
            )}

            {dropdownOpen &&
              (isAuthenticated() ? (
                <div className="menu">
                  <div className="user-badge">
                    <div className="user-initial">{userInitial}</div>
                    <div className="profile-details">
                      <span className="username">{user.name}</span>
                      <span className="email">{user.email}</span>
                    </div>
                  </div>
                  <div className="menu-item">
                    <Link to="/Profile" className="dropdown-item">
                      Profile
                    </Link>
                  </div>
                  <div className="menu-item">
                    <Link to="/preferences" className="dropdown-item">
                      Preference Settings
                    </Link>
                  </div>
                  <div className="menu-item">
                    <Link to="/preferenceview" className="dropdown-item">
                      My Personlized View
                    </Link>
                  </div>
                  <div className="menu-item">
                    <a
                      onClick={handleLogoutClick}
                      className="dropdown-item"
                      role="button"
                    >
                      Logout
                    </a>
                  </div>
                </div>
              ) : (
                <div className="dropdown-menu">
                  <Link to="/Login" className="dropdown-item">
                    Login
                  </Link>
                  <Link to="/SignUp" className="dropdown-item">
                    Sign Up
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </header>

      {/* ✅ Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button className="confirm-btn" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="checkmark-circle">
              <svg className="checkmark" viewBox="0 0 52 52">
                <path
                  fill="none"
                  stroke="#4CAF50"
                  strokeWidth="5"
                  d="M14 27l7 7 17-17"
                />
              </svg>
            </div>
            <h3>Logged Out Successfully!</h3>
            <p>Thank you for using BuySmart.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MainHeader;
