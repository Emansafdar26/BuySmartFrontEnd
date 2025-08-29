// components/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

const PrivateRoute = ({ children }) => {
   const location = useLocation()
  if (isAuthenticated()) {
    return children
  } else {
    localStorage.setItem('route', location.pathname)
    return <Navigate to="/login" />
  }
};

export default PrivateRoute;