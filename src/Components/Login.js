import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../Styles/Login.css";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { apiGet, apiPost } from "../lib/apiwrapper";
import MainHeader from "./MainHeader";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [primaryMessage, setPrimaryMessage] = useState("");
  const [secondaryMessage, setSecondaryMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    apiPost("/auth/login", formData)
      .then((res) => {
        if (res.detail && res.detail.code === 1) {
          // ✅ Save token consistently
          localStorage.setItem("accessToken", res.detail.access_token);

          // ✅ Fetch profile
          apiGet("/auth/profile").then((resp) => {
            if (resp.detail && resp.detail.code === 1) {
              const userData = resp.detail.data;
              localStorage.setItem("user", JSON.stringify(userData));

              setPrimaryMessage("Login successful!");
              setSecondaryMessage(`Hey ${userData.name}, Welcome`);
              setShowSuccessModal(true);

              setTimeout(() => {
                setShowSuccessModal(false);

                // ✅ check for stored redirect (e.g. /product/:id)
                const redirectPath = localStorage.getItem("redirectAfterLogin");
                localStorage.removeItem("redirectAfterLogin");

                if (res.detail.role === "SuperAdmin" || res.detail.role === "Admin") {
                  navigate("/admin/dashboard");
                } else if (redirectPath) {
                  navigate(redirectPath);
                } else {
                  const route = location.state?.from || "/";
                  navigate(route);
                }
              }, 2000);
            } else {
              setErrors({ password: resp.detail?.error || "Error fetching profile" });
            }
          });
        } else if (res.detail?.code === 0) {
          setErrors({ password: res.detail.error });
        }
      })
      .catch(() => setErrors({ password: "Something went wrong!" }));
  };

  return (
    <>
    <MainHeader/>
    <div className="login-page">
      <div className="login-container">
        <div className="left-panel">
          <h2>Hello, Welcome!</h2>
          <p>Don't have an account?</p>
          <Link to="/signup" className="register-btn">
            Register
          </Link>
        </div>

        <div className="right-panel">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            {errors.email && <p className="login-error">{errors.email}</p>}

            <div className="login-password-container">
              <input
                type={showPassword ? "text" : "password"}
                className="login-input"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="login-toggle-icon"
              >
                {showPassword ? <BsEyeSlash /> : <BsEye />}
              </span>
            </div>
            {errors.password && <p className="login-error">{errors.password}</p>}

            <button type="submit" className="login-button">
              Login
            </button>
            <p className="login-text">
              Forgot Password? <Link to="/forgot-password">Reset</Link>
            </p>
            <button
              type="button"
              className="login-back-btn"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </form>
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
            <h3>{primaryMessage}</h3>
            <p>{secondaryMessage}</p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Login;
