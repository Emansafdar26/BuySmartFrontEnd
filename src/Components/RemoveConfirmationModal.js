import React from 'react';
import '../Styles/RemoveConfirmationModal.css';

const RemoveConfirmationModal = ({ product, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>Remove from Favourites?</h3>
        <p>Are you sure you want to remove <strong>{product.title}</strong> from your favourites?</p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>Yes, Remove</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default RemoveConfirmationModal;
