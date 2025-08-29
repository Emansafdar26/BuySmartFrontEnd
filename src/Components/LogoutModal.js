import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="logout-modal">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to logout?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
