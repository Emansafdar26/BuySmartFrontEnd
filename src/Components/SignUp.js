import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsEye, BsEyeSlash } from "react-icons/bs"; 
import "../Styles/SignUp.css";
import { apiPost } from '../lib/apiwrapper';

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

  const validateForm = () => {
    let newErrors = {};

    if (!formData.name.match(/^[a-zA-Z0-9]{3,}$/)) {
      newErrors.name = "Name must be at least 3 characters (no special symbols)";
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    } else {
      if (!formData.email.startsWith(formData.email[0].toLowerCase()) && !formData.email.startsWith(formData.email[0].toUpperCase())) {
        newErrors.email = "Email must start with an alphabet";
      }
      if (!/^[a-zA-Z]/.test(formData.email)) {
        newErrors.email = "Email must start with an alphabet";
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.(com)$/)) {
        newErrors.email = "Only '.com' email addresses are allowed";
      }
    }

    if (!formData.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      newErrors.password =
        "Password must be at least 8 characters, with uppercase, lowercase, number, and special character";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      apiPost('/auth/register', formData).then((res) => {
        if (res.detail) {
          if (res.detail.code === 1) {
            setShowSuccessModal(true);
            setTimeout(() => {
              setShowSuccessModal(false);
              navigate('/');
            }, 2000);
          } else if (res.detail.code === 0) {
            let newErrors = {};
            newErrors.confirmPassword = res.detail.error;
            setErrors(newErrors);
          }
        }
      }).catch((err) => {
        console.log("error", err);
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <span 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className="toggle-icon"
            aria-label="Toggle confirm password visibility"
          >
            {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
          </span>
        </div>
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

        <button type="submit">Sign Up</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>


{showSuccessModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="checkmark-circle">
        <svg className="checkmark" viewBox="0 0 52 52">
          <path fill="none" stroke="#4CAF50" strokeWidth="5" d="M14 27l7 7 17-17" />
        </svg>
      </div>
      <h3>Registration Successful!</h3>
      <p>Your account has been created successfully.</p>
    </div>
  </div>
)}

    </div>
  );
};

export default Signup;
