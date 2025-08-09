// components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../lib/auth";

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" /> : children;
};

export default PublicRoute;
