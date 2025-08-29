import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { apiPost } from "../lib/apiwrapper";
import { isAuthenticated, getAccessToken } from "../lib/auth"; 
import "../Styles/FeedbackForm.css";

const FeedbackForm = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [showThanks, setShowThanks] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const options = [
    "Ease of use",
    "Speed & Performance",
    "Design & Interface",
  ];

  const handleOptionChange = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated()) return;

    if (rating === 0 && selectedOptions.length === 0 && suggestion.trim() === "") {
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const feedbackData = { rating, selected_options: selectedOptions, suggestion };
    const token = getAccessToken();

    try {
      const response = await apiPost("/feedback", feedbackData, {
        headers: {Authorization: `Bearer ${token}` },
      });

      if (response.detail?.code === 1) {
        // success
        setShowThanks(true);
        setRating(0);
        setSelectedOptions([]);
        setSuggestion("");

        setTimeout(() => {
          setShowThanks(false);
          onClose();
        }, 2000);
      } else {
        setErrorMsg(response.detail?.error || "Failed to submit feedback");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch (err) {
      const apiError = err.response?.data?.detail?.error || "Something went wrong!";
      setErrorMsg(apiError);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="feedback-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="feedback-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="feedback-title">We value your feedback</h2>

              <div className="feedback-rating">
                <p>How was your overall experience?</p>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <AiFillStar
                      key={star}
                      size={32}
                      className={rating >= star ? "star active" : "star"}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="feedback-options">
                <p>Which parts should we improve?</p>
                <div className="options-grid">
                  {options.map((option) => (
                    <label key={option} className="option-label">
                      <input
                        type="checkbox"
                        checked={selectedOptions.includes(option)}
                        onChange={() => handleOptionChange(option)}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="feedback-text">
                <p>Any suggestions for us?</p>
                <textarea
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Write here..."
                />
              </div>

              {showError && <p className="feedback-error">{errorMsg}</p>}

              <div className="feedback-actions">
                <button className="btn cancel" onClick={onClose}>Cancel</button>
                <button className="btn submit" onClick={handleSubmit}>Send Feedback</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThanks && (
          <motion.div
            className="modal-overlay success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="modal-content"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Thank you!</h3>
              <p>Your feedback helps us improve BuySmart.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackForm;