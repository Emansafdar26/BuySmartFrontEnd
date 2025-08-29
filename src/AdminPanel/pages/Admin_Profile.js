import React, { useState, useEffect } from "react";
import MainHeader from "../../Components/MainHeader";
import { BsPencil } from "react-icons/bs";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { apiGet, apiPost } from "../../lib/apiwrapper";

const AdminProfile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);

  // 🔹 Fetch profile
  useEffect(() => {
    apiGet("/auth/profile")
      .then((res) => {
        if (res.detail?.code === 1) {
          setUsername(res.detail.data.name);
          setEmail(res.detail.data.email);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const validateForm = () => {
    let newErrors = {};

    if (isEditingUsername && !username.match(/^[a-zA-Z ]{3,}$/)) {
      newErrors.username =
        "Username must be at least 3 characters and contain only letters and spaces";
    }

    if (isEditingPassword && isCurrentPasswordValid) {
      if (newPassword) {
        if (
          !newPassword.match(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        ) {
          newErrors.newPassword =
            "Password must be 8+ chars with uppercase, lowercase, number & special character";
        }
      }

      if (newPassword && confirmPassword !== newPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCurrentPassword = () => {
    if (!currentPassword) {
      setErrors({ currentPassword: "Please enter your current password" });
      return;
    }

    apiPost("/auth/verify-password", { current_password: currentPassword })
      .then((res) => {
        if (res.detail?.code === 1) {
          setIsCurrentPasswordValid(true);
          setErrors({});
        } else {
          setIsCurrentPasswordValid(false);
          setErrors({ currentPassword: "Current password is incorrect" });
        }
      })
      .catch(() =>
        setErrors({ currentPassword: "Something went wrong verifying password" })
      );
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    apiPost("/auth/update-profile", {
      username: isEditingUsername ? username : null,
      current_password: isEditingPassword ? currentPassword : null,
      new_password: isEditingPassword ? newPassword : null,
      confirm_password: isEditingPassword ? confirmPassword : null,
    })
      .then((res) => {
        if (res.detail?.code === 1) {
          setSuccessMessage(res.detail.message);
          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 2500);

          setIsEditingUsername(false);
          setIsEditingPassword(false);
          setIsCurrentPasswordValid(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setErrors({ general: res.detail?.error || "Update failed" });
        }
      })
      .catch(() => setErrors({ general: "Something went wrong!" }));
  };

  return (
    <>
    <MainHeader/>
        <div className="admin-profile-container">
        <h2>My Profile</h2>
        <div className="admin-avatar">{username?.charAt(0).toUpperCase()}</div>

        <form className="admin-profile-form" onSubmit={handleUpdateProfile}>
          {/* Username */}
          <div className="admin-form-group">
            <label>Username</label>
            <div className="admin-input-wrapper">
              <input
                type="text"
                value={username}
                disabled={!isEditingUsername}
                onChange={(e) => setUsername(e.target.value)}
              />
              <BsPencil
                className="edit-icon"
                onClick={() => setIsEditingUsername(true)}
              />
            </div>
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="admin-form-group">
            <label>Email</label>
            <input type="email" value={email} disabled />
          </div>

          {/* Password Section */}
          {!isEditingPassword && (
            <div className="admin-form-group">
              <label>Password</label>
              <div className="admin-input-wrapper">
                <input type="password" value="********" disabled />
                <BsPencil
                  className="admin-edit-icon"
                  onClick={() => setIsEditingPassword(true)}
                />
              </div>
            </div>
          )}

          {isEditingPassword && (
            <>
              {/* Current Password */}
              <div className="admin-form-group">
                <label>Current Password</label>
                <div className="admin-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleVerifyCurrentPassword()
                    }
                    onBlur={handleVerifyCurrentPassword}  
                    placeholder="Enter current password"
                  />
                  {showCurrentPassword ? (
                    <FaEyeSlash
                      className="eye-icon"
                      onClick={() => setShowCurrentPassword(false)}
                    />
                  ) : (
                    <FaEye
                      className="eye-icon"
                      onClick={() => setShowCurrentPassword(true)}
                    />
                  )}
                  
                </div>
                {errors.currentPassword && (
                  <p className="error">{errors.currentPassword}</p>
                )}
              </div>
              {isCurrentPasswordValid && (
                <>
                  <div className="admin-form-group">
                    <label>New Password</label>
                    <div className="admin-input-wrapper">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                      {showNewPassword ? (
                        <FaEyeSlash
                          className="admin-eye-icon"
                          onClick={() => setShowNewPassword(false)}
                        />
                      ) : (
                        <FaEye
                          className="admin-eye-icon"
                          onClick={() => setShowNewPassword(true)}
                        />
                      )}
                    </div>
                    {errors.newPassword && (
                      <p className="error">{errors.newPassword}</p>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label>Confirm New Password</label>
                    <div className="admin-input-wrapper">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      {showConfirmPassword ? (
                        <FaEyeSlash
                          className="admin-eye-icon"
                          onClick={() => setShowConfirmPassword(false)}
                        />
                      ) : (
                        <FaEye
                          className="admin-eye-icon"
                          onClick={() => setShowConfirmPassword(true)}
                        />
                      )}
                    </div>
                    {errors.confirmPassword && (
                      <p className="error">{errors.confirmPassword}</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {errors.general && <p className="admin-general-error">{errors.general}</p>}

          <button type="submit" className="admin-update-btn">
            Update Profile
          </button>
        </form>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaCheckCircle className="success-check" />
            <h3>{successMessage}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminProfile;
