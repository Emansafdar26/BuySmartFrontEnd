import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../lib/apiwrapper";
import MainHeader from "../../Components/MainHeader";

function Scraper() {
  const [interval, setInterval] = useState(30);
  const [newInterval, setNewInterval] = useState(30);
  const [status, setStatus] = useState("stopped");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchScraperStatus = async () => {
      try {
        const response = await apiGet("/admin/scraper/status");

        if (response?.detail) {
          const detail = response.detail;
          setStatus(detail.is_running ? "running" : "stopped");
          setInterval(detail.interval_minutes);
          setNewInterval(detail.interval_minutes);
        } else {
          setStatus("stopped");
        }
      } catch (error) {
        console.error("Error fetching scraper status:", error);
        setStatus("stopped");
      }
    };

    fetchScraperStatus();
  }, []);

  // ✅ Save new interval
  const handleSaveInterval = async () => {
    if (newInterval < 1) {
      setMessage("Interval must be at least 1 minute.");
      setMessageType("error");
    } else if (newInterval > 180) {
      setMessage("Interval cannot exceed 180 minutes.");
      setMessageType("error");
    } else {
      try {
        const response = await apiPost("/admin/scraper/interval", {
          interval: newInterval,
        });

        if (response?.detail?.code === 1) {
          setInterval(newInterval);
          setMessage(`Scraper interval updated to ${newInterval} minutes!`);
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
    }

    clearMessageAfterDelay();
  };

  const handleStartScraper = async () => {
    try {
      const response = await apiPost("/admin/scraper/start");

      if (response.detail && response.detail.code === 1) {
        setStatus("running");
        setMessage(response.detail.message);
        setMessageType("success");
      } else {
        setMessage("Failed to start scraper.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error starting scraper.");
      setMessageType("error");
      console.error("Error:", error);
    }
    clearMessageAfterDelay();
  };

  const handleStopScraper = async () => {
    try {
      const response = await apiPost("/admin/scraper/stop");

      if (response.detail && response.detail.code === 1) {
        setStatus("stopped");
        setMessage(response.detail.message);
        setMessageType("success");
      } else {
        setMessage("Failed to stop scraper.");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error stopping scraper.");
      setMessageType("error");
      console.error("Error:", error);
    }
    clearMessageAfterDelay();
  };

  const clearMessageAfterDelay = () => {
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  // ✅ Handle input change with immediate error message
  const handleIntervalChange = (value) => {
    if (value > 180) {
      setMessage("Interval cannot exceed 180 minutes.");
      setMessageType("error");
      setNewInterval(180);
    } else if (value < 1) {
      setMessage("Interval must be at least 1 minute.");
      setMessageType("error");
      setNewInterval(1);
    } else {
      setMessage("");
      setMessageType("");
      setNewInterval(value);
    }
  };

  return (
    <>
      <MainHeader />
      <main className="scraper-main-container">
        <div className="scraper-title">
          <h3>SCRAPER MANAGEMENT</h3>
        </div>

        <div className="scraper-status">
          <h4>
            Status:{" "}
            <span className={status === "running" ? "running" : "stopped"}>
              {status.toUpperCase()}
            </span>
          </h4>
          <div className="scraper-actions">
            <button
              className="start-btn"
              onClick={handleStartScraper}
              disabled={status === "running"}
            >
              Start
            </button>
            <button
              className="stop-btn"
              onClick={handleStopScraper}
              disabled={status === "stopped"}
            >
              Stop
            </button>
          </div>
        </div>

        <div className="scraper-config">
          <h4>Configuration</h4>
          <label>
            Scraping Interval (Minutes):
            <input
              type="number"
              value={newInterval}
              onChange={(e) => handleIntervalChange(Number(e.target.value))}
              min="1"
              max="180"
              className="interval-input"
            />
          </label>

          <button className="save-interval-btn" onClick={handleSaveInterval}>
            Save Interval
          </button>
        </div>

        {message && (
          <div className={`status-message ${messageType}`}>{message}</div>
        )}
      </main>
    </>
  );
}

export default Scraper;
