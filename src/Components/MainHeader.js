import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, NavLink } from "react-router-dom";
import { BsCart3, BsSearch, BsPersonCircle, BsBell } from "react-icons/bs";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { isAuthenticated } from "../lib/auth";
import { apiGet, apiPost } from "../lib/apiwrapper";
import "../Styles/Navbar.css";
import CategoryDropdown from "./CategoryDropdown";
import "../Styles/MainHeader.css";

const MainHeader = ({ onSearch }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  // Profile dropdown
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const route = useLocation();

  const handleLogoutClick = () => setShowConfirmModal(true);

  const confirmLogout = () => {
    setShowConfirmModal(false);
    localStorage.clear();
    setShowLogoutModal(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      navigate("/");
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
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const res = await apiGet("/getNotifications");
      if (res.detail && res.detail.code === 1) {
        setNotifications(res.detail.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await apiPost("/readNotification", { notification_id: id });
      if (res.detail && res.detail.code === 1) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const user = isAuthenticated()
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const userInitial = user ? user.name.charAt(0).toUpperCase() : "";
  const isAdmin = user && (user.role === "Admin" || user.role === "SuperAdmin");

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
              {!isAdmin && (
                <>
                  <li>
                    <NavLink to="/favourites" activeclassname="active">
                      Wishlist
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/price-alerts" activeclassname="active">
                      Price Alerts
                    </NavLink>
                  </li>
                </>
              )}
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

          <div className="profile-section">
            {isAuthenticated() && !isAdmin && (
              <div
                className="notification-icon"
                ref={notificationRef}
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <BsBell size={24} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount}</span>
                )}
              </div>
            )}

            {showNotifications && isAuthenticated() && !isAdmin && (
              <div className="menu notification-menu">
                {loadingNotifications ? (
                  <p>Loading...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="menu-item"
                      style={{
                        backgroundColor: n.is_read ? "#f5f5f5" : "#e8f0ff",
                        fontWeight: n.is_read ? "normal" : "bold",
                        cursor: "pointer",
                        transition: "all 0.2s ease-in-out"
                      }}
                      onClick={() => handleMarkAsRead(n.id)}
                    >
                      <p>
                        <strong>{n.type}</strong> — Rs.{n.price}
                      </p>
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        {new Date(n.date).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="menu-item">No notifications</p>
                )}
              </div>
            )}

            {user ? (
              <div
                className="user-badge"
                ref={profileRef}
                onClick={() => setShowProfileMenu((prev) => !prev)}
              >
                <div className="user-initial">{userInitial}</div>

                {showProfileMenu && (
                  <div className="menu profile-menu">
                    <div className="user-badge">
                      <div className="user-initial">{userInitial}</div>
                      <div className="profile-details">
                        <span className="username">{user.name}</span>
                        <span className="email">{user.email}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <>
                        <div className="menu-item">
                          <Link to="/admin/admin-profile" className="dropdown-item">
                            Update Profile
                          </Link>
                        </div>
                        <div className="menu-item">
                          <Link
                            to="/admin/dashboard"
                            className="dropdown-item"
                          >
                            Dashboard
                          </Link>
                        </div>
                      </>
                    )}

                    {!isAdmin && (
                      <div className="menu-item">
                        <Link to="/account" className="dropdown-item">
                          Account
                        </Link>
                      </div>
                    )}

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
                )}
              </div>
            ) : (
              <div
                className="profile-icon"
                onClick={() => navigate("/login")}
              >
                <BsPersonCircle size={30} />
              </div>
            )}
          </div>
        </div>
      </header>

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
