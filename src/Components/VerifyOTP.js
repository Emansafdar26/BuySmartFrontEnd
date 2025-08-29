import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import MainHeader from "./MainHeader";
import { apiPost } from "../lib/apiwrapper";
import "../Styles/VerifyOTP.css";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle OTP verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await apiPost("/auth/register/verify", { email, otp });

      if (response.detail?.code === 1) {
        setSuccessMsg(response.detail.message || "OTP verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.detail?.error || "OTP verification failed.");
      }
    } catch (err) {
      const apiError = err.response?.data?.detail?.error || "Something went wrong. Please try again.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Resend OTP
  const handleResendOtp = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const response = await apiPost("/auth/register/resend-otp", { email });

      if (response.detail?.code === 1) {
        setSuccessMsg(response.detail?.message || "New OTP sent to your email!");
      } else {
        setError(response.detail?.error || "Failed to resend OTP.");
      }
    } catch (err) {
      const apiError = err.response?.data?.detail?.error || "Failed to resend OTP. Please try again.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <MainHeader/>
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-left-panel">
          <h2>Email Verification</h2>
          <p style={{ marginBottom: "20px", color: "#555" }}>
            Please enter the OTP sent to your email <b>{email}</b>
          </p>

          <form onSubmit={handleVerifyOtp}>
            <input
              type="text"
              placeholder="Enter OTP"
              className="signup-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
            {error && <p className="error-message">{error}</p>}
            {successMsg && <p className="success-message">{successMsg}</p>}
            <button type="submit" className="otp-button" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <button
            onClick={handleResendOtp}
            className="otp-button"
            disabled={loading}
          >
            Resend OTP
          </button>
            <Link to="/signup" className="signup-back-btn">Go back to Signup</Link>
        </div>
        <div className="otp-right-panel">
          <h2>Verify Your Email</h2>
          <p>Enter the OTP to complete your signup process and access your account.</p>
          <Link to="/login" className="otp-login-btn">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default VerifyOtp;