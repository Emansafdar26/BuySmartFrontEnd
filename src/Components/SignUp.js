import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import "../Styles/SignUp.css";
import { apiPost } from "../lib/apiwrapper";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "User",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState(""); // <-- to show backend error message
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.match(/^[a-zA-Z ]{3,}$/)) {
      newErrors.name =
        "Name must be at least 3 characters and contain only letters and spaces";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    } else if (!formData.email.match(/^[a-zA-Z]/)) {
      newErrors.email = "Email must start with an alphabet";
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.(com)$/)) {
      newErrors.email = "Only '.com' email addresses are allowed";
    }

    if (
      !formData.password.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/

      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Signup API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset backend error

    if (validateForm()) {
      setLoading(true);
      try {
        const res = await apiPost("/auth/register/init", formData);

        // If success → show modal & navigate to OTP verification page
        if (res?.detail?.code === 1) {
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            navigate("/verify-otp", {
              state: { email: formData.email },
            });
          }, 2000);
        } else {
          setError(res?.detail?.error || "Something went wrong, please try again.");
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError("Server error, please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left-panel">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="signup-input"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            {errors.name && <p className="error">{errors.name}</p>}
                
            <input type="email" className="signup-input" placeholder="Enter your email" value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="error">{errors.email}</p>}
            {error && <p className="error-message">{error}</p>}
            <div className="password-container">
              <input  type={showPassword ? "text" : "password"}  className="signup-input"  placeholder="Enter password"  value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="toggle-icon"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
            <div className="password-container">
              <input  type={showConfirmPassword ? "text" : "password"}  className="signup-input"  placeholder="Confirm password"  value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <span
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="toggle-icon"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword}</p>
            )}
            <button  type="submit"  className="signup-button"  disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <p className="signup-text">
              Already have an account? <Link to="/login">Login</Link>
            </p>
            <Link to="/" className="signup-back-btn">
              Back
            </Link>
          </form>
        </div>

        <div className="signup-right-panel">
          <h2>Hello, Welcome!</h2>
          <p>Ready to start your journey? Create your account now!</p>
        </div>
      </div>

      {showSuccessModal && (
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
            <h3>OTP Sent!</h3>
            <p>We’ve sent an OTP to your email. Please verify your account.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
