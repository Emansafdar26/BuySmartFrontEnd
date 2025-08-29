import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainHeader from "./MainHeader";
import "../Styles/ForgotPassword.css";
import { apiPost } from "../lib/apiwrapper";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Invalid email format");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!validateEmail()) return;
    apiPost("/auth/forget-password", { email })
      .then((res) => {
        if (res.detail.code === 1) {
          setSuccess(res.detail.message || "Check your email for temporary password.");
        } else {
          setError(res.detail.error || "Something went wrong.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
    <MainHeader/>
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-left-panel">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="forgot-password-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="forgot-password-error">{error}</p>}
            {success && <p className="forgot-password-success">{success}</p>}
            <button type="submit" className="forgot-password-button">
              Send Reset Link
            </button>
            <p className="forgot-password-text">
              Remembered your password?{" "}
              <Link to="/login" className="forgot-password-link">
                Login
              </Link>
            </p>
            <Link to="/" className="forgot-password-back-btn">Back</Link>
          </form>
        </div>
        <div className="forgot-password-right-panel">
          <h2>Hello, Welcome!</h2>
          <p>Enter email to get a temporary password.</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;
