import React, { useState, useEffect } from "react";
import { BsFillPencilFill } from "react-icons/bs";
import "../Styles/Profile.css";
import { apiGet, apiPost } from "../lib/apiwrapper"; 

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [editField, setEditField] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load profile on mount
  useEffect(() => {
    apiGet('/auth/profile') // Adjust path if needed
      .then((res) => {
        if (res.detail && res.detail.code === 1) {
          setProfile({
            username: res.detail.data.name,
            email: res.detail.data.email,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, []);

  const handleSave = () => {
    let validationErrors = {};

    if (editField === "username") {
      if (!profile.username.trim().match(/^[a-zA-Z0-9]{3,}$/)) {
        validationErrors.username =
          "Username must be at least 3 characters (no special characters)";
      }
    }

    if (editField === "email") {
      if (!profile.email.trim().match(/^[^\s@]+@[^\s@]+\.(com)$/)) {
        validationErrors.email = "Invalid email format";
      }
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      apiPost("/auth/update-profile", {
        username: profile.username,
        email: profile.email,
      })
        .then((res) => {
          if (res.message === "Profile updated successfully") {
            setSuccessMessage("Profile updated successfully!");
            setEditField(null);
            setTimeout(() => setSuccessMessage(""), 3000);
          }
        })
        .catch((err) => {
          console.error("Error updating profile:", err);
        });
    }
  };

  return (
    <div className="update-profile-container">
      <h2>Your Profile</h2>

      <div className="profile-info">
        <div className="profile-field">
          <label>Username:</label>
          {editField === "username" ? (
            <>
              <input
                type="text"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </>
          ) : (
            <span>{profile.username}</span>
          )}
          <button
            className="edit-btn"
            onClick={() => {
              setEditField("username");
              setErrors({});
              setSuccessMessage("");
            }}
          >
            <BsFillPencilFill />
          </button>
        </div>

        <div className="profile-field">
          <label>Email:</label>
          {editField === "email" ? (
            <>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </>
          ) : (
            <span>{profile.email}</span>
          )}
          <button
            className="edit-btn"
            onClick={() => {
              setEditField("email");
              setErrors({});
              setSuccessMessage("");
            }}
          >
            <BsFillPencilFill />
          </button>
        </div>

        {editField && (
          <button className="update-btn" onClick={handleSave}>
            Update
          </button>
        )}

        {successMessage && (
          <p className="success-text">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
