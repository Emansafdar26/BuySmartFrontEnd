import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Styles/Login.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { apiGet, apiPost } from '../lib/apiwrapper'

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const validateForm = () => {
    let newErrors = {};

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }

    // if (
    //   !formData.password.match(
    //       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        
    //   )
    // ) {
    //   newErrors.password =
    //     "Password must be at least 8 characters, with uppercase, lowercase, number, and special character";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      apiPost('/auth/login', formData).then((res) => {
        if (res.detail) {
          if (res.detail.code === 1) {
            console.log(res.detail.access_token)
            localStorage.setItem('accessToken', res.detail.access_token)
  
            // Fetch user profile to check role
            apiGet('/auth/profile').then((resp) => {
              if (resp.detail) {
                if (resp.detail.code === 1) {
                  const userData = resp.detail.data;
                  localStorage.setItem('user', JSON.stringify(userData));
  
                  // Role-based navigation
                  if (userData.role === 'Admin') {
                    navigate('/admin/dashboard'); // Navigate to admin dashboard
                  } else {
                    navigate('/'); // Navigate to home for normal users
                  }
  
                } else {
                  setErrors({ password: resp.detail.error });
                }
              }
            });
          } else if (res.detail.code === 0) {
            setErrors({ password: res.detail.error });
          }
        }
      }).catch((err) => {
        console.log("error", err)
      });
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-input"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className="login-error">{errors.email}</p>}

          <div className="login-password-container">
            <input
              type={showPassword ? "text" : "password"}
              className="login-input"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="login-toggle-icon"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </span>
          </div>
          {errors.password && <p className="login-error">{errors.password}</p>}

          <button type="submit" className="login-button">
            Login
          </button>

          <p className="login-text">
            Forgot password? <Link to="/forgot-password">Reset</Link>
          </p>
          <p className="login-text">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
