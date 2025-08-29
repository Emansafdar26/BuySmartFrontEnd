import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import { isAuthenticated } from "../lib/auth";
import { BsChatSquareText } from "react-icons/bs";
import "../Styles/FeedbackButton.css";

const FeedbackButton = () => {
  const [showForm, setShowForm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const user = isAuthenticated() ? JSON.parse(localStorage.getItem("user")) : null;
  const isAdmin = user && (user.role === "Admin" || user.role === "SuperAdmin");

  const handleClick = () => {
    if (isAuthenticated()) {
      setShowForm(true);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const closeLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  if (isAdmin) return null;

  return (
    <>
      <button className="floating-feedback-btn" onClick={handleClick}>
        <BsChatSquareText className="icons" /> Feedback
      </button>

      {showForm && isAuthenticated() && (
        <FeedbackForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
        />
      )}
      {showLoginPrompt && !isAuthenticated() && (
        <div className="modal-overlay error">
          <div className="modal-content">
            <h3>Login Required</h3>
            <p style={{marginTop:"35px"}}>You need to be logged in to submit feedback.</p>
            <div className="feedback-actions" style={{ justifyContent: "center" }}>
              <a
                href="/login"
                className="btn login-btn"
                style={{ marginRight: "10px" }}
                onClick={closeLoginPrompt}
              >
                Go to Login
              </a>
              <a
                href="/signup"
                className="btn signup-btn"
                style={{ marginRight: "10px" }}
                onClick={closeLoginPrompt}
              >
                Create Account
              </a>
              <button className="back-btn "  onClick={closeLoginPrompt}style={{marginTop:"25px", width:"270px"}}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
