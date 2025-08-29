export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token; // true if token exists
  };

export const getAccessToken = () => {
  return localStorage.getItem('accessToken') || "";
};