
const BASE_URL = "http://localhost:8000/api"; // Update to your backend URL

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Generic GET request
export const apiGet = async (endpoint) => {
  const token = getAuthToken();
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("GET Error:", err);
    throw err;
  }
};

// Generic POST request
export const apiPost = async (endpoint, body) => {
  const token = getAuthToken();
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("POST Error:", err);
    throw err;
  }
};
