import React, { useState } from "react";
import { apiGet, apiPost } from "../../lib/apiwrapper"; // Assuming apiPost handles POST requests
import MainHeader from "../../Components/MainHeader";

function Scraper() {
  const [interval, setInterval] = useState(30); // default 30 minutes
  const [newInterval, setNewInterval] = useState(30); // temporary input
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSaveInterval = async () => {
    if (newInterval >= 1) {
      try {
        // Send POST request with 'interval_minutes' instead of 'interval'
        const response = await apiPost("/admin/scraper/interval", {
          interval_minutes: newInterval, // Changed here
        });
  
        if (response.data.detail.code === 1) {
          setInterval(newInterval); // Update the interval in the UI
          setMessage("Scraper interval updated successfully!");
          setMessageType("success");
        } else {
          setMessage("Failed to update interval.");
          setMessageType("error");
        }
      } catch (error) {
        setMessage("Error updating interval.");
        setMessageType("error");
        console.error("Error:", error);
      }
    } else {
      setMessage("Interval must be at least 1 minute.");
      setMessageType("error");
    }
  
    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };
  
  return (
    <>
      <MainHeader />
      <main className="scraper-main-container">
        <div className="scraper-title">
          <h3>SCRAPER MANAGEMENT</h3>
        </div>

        <div className="scraper-config">
          <h4>Configuration</h4>
          <label>
            Scraping Interval (Minutes):
            <input
              type="number"
              value={newInterval}
              onChange={(e) => setNewInterval(Number(e.target.value))}
              min="1"
              className="interval-input"
            />
          </label>

          <button className="save-interval-btn" onClick={handleSaveInterval}>
            Save Interval
          </button>

          {message && (
            <div className={`status-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Scraper;
