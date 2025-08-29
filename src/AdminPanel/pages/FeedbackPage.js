import React, { useState, useEffect } from "react";
import MainHeader from "../../Components/MainHeader";
import { AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../../lib/apiwrapper"; // ✅ Using your existing API wrapper

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch feedbacks for Admins & SuperAdmins only
  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await apiGet("/admin/get-feedback");

      if (res?.detail?.code === 1) {
        setFeedbacks(res.detail.data);
      } else if (res?.detail?.message?.includes("Access denied")) {
        // ❌ Non-admin users are redirected
        alert("Only admins can view feedback!");
        navigate("/");
      } else {
        setError(res?.detail?.error || "Failed to fetch feedbacks");
      }
    } catch (err) {
      setError("Something went wrong while fetching feedbacks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = (id) => {
    setFeedbacks(feedbacks.filter((f) => f.feedback_id !== id));
  };

  return (
    <>
      <MainHeader />
      <div className="users-container">
        <h2 className="users-title">System Feedback</h2>

        {/* ✅ Show loading state */}
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading feedbacks...</p>
        ) : error ? (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        ) : (
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Selected Options</th>
                  <th>Suggestion</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb) => (
                  <tr key={fb.feedback_id}>
                    <td>{fb.username}</td>
                    <td>{fb.email}</td>
                    <td>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <AiFillStar
                          key={star}
                          size={18}
                          className={fb.rating >= star ? "star active" : "star"}
                        />
                      ))}
                    </td>
                    <td>{fb.selected_options.join(", ")}</td>
                    <td>{fb.suggestion}</td>
                    <td>{fb.created_at}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(fb.feedback_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* ✅ Show empty state */}
                {feedbacks.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No feedback available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default FeedbackPage;