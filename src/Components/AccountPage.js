import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";
import MainHeader from "./MainHeader";
import Carousel from "./Carousel";
import Footer from "./Footer";
import "../Styles/AccountPage.css";

const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = isAuthenticated() ? JSON.parse(localStorage.getItem("user")) : null;
  const isAdmin = user && (user.role === "Admin" || user.role === "SuperAdmin");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // 🔄 Redirect to profile by default if just "/account"
  useEffect(() => {
    if (location.pathname === "/account") {
      navigate("/account/profile", { replace: true });
    }
  }, [location, navigate]);

  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/"); // redirect after logout
  };

  if (!user) {
    return (
      <div className="accountpage-notloggedin">
        <h2 className="accountpage-notloggedin-title">You are not logged in.</h2>
        <div className="accountpage-auth-links">
          <Link to="/Login" className="accountpage-auth-btn">Login</Link>
          <Link to="/SignUp" className="accountpage-auth-btn">Sign Up</Link>
        </div>
      </div>
    );
  }

  const handleSearch = () => navigate("/products");

  return (
    <>
      <MainHeader onSearch={handleSearch} />
 
      <div className="accountpage-container">
        {/* Sidebar */}
        <aside className="accountpage-sidebar">
          <div className="accountpage-user-info">
            <div className="accountpage-user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="accountpage-user-details">
              <p className="accountpage-username">{user.name}</p>
              <p className="accountpage-email">{user.email}</p>
            </div>
          </div>

          <nav className="accountpage-menu">
            <Link to="profile" className="accountpage-menu-item">Profile</Link>
            {isAdmin ? (
              <Link to="/admin/dashboard" className="accountpage-menu-item">Dashboard</Link>
            ) : (
              <>
                <Link to="preferences" className="accountpage-menu-item">Preference Settings</Link>
                <Link to="personalized" className="accountpage-menu-item">My Personalized View</Link>
              </>
            )}
            <button
              className="accountpage-menu-item accountpage-logout-btn"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="accountpage-content">
          <Outlet />
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="accountpage-modal-overlay">
          <div className="accountpage-modal">
            <h3 className="accountpage-modal-title">Confirm Logout</h3>
            <p className="accountpage-modal-text">Are you sure you want to logout?</p>
            <div className="accountpage-modal-actions">
              <button
                className="accountpage-modal-btn accountpage-cancel-btn"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="accountpage-modal-btn accountpage-confirm-btn"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default AccountPage;
