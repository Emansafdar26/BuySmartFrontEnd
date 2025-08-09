import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./AdminPanel/AdminPanel.css";
import { SearchProvider } from "./AdminPanel/context/SearchContext";
import Header from "./AdminPanel/pages/Sidebar";
import Sidebar from "./AdminPanel/pages/Sidebar";
import Dashboard from "./AdminPanel/pages/Dashboard";
import Users from "./AdminPanel/pages/Users";
import Categories from "./AdminPanel/pages/Categories";
import Admin_Products from "./AdminPanel/pages/Admin_Products";
import Platforms from "./AdminPanel/pages/Platform";
import Admin_ProductDetails from "./AdminPanel/pages/Admin_ProductDetails";
import Scraper from "./AdminPanel/pages/Scraper";
import Home from "./Components/Home";
import Products from "./Components/Products";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import Profile from "./Components/Profile";
import ForgotPassword from "./Components/ForgotPassword";
import ProductDetail from "./Components/ProductDetail";
import Favourites from "./Components/Favourites";
import PriceAlerts from "./Components/PriceAlerts";

import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };


  useEffect(() => {
    if (window.location.pathname.startsWith("/admin")) {
      document.body.setAttribute("data-theme", theme);
    } else {
      document.body.setAttribute("data-theme", "light"); 
    }
  }, [theme]);

  return (
    
    <SearchProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
    
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
    
          {/* Private Routes */}
          <Route
            path="/Profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/favourites"
            element={
              <PrivateRoute>
                <Favourites />
              </PrivateRoute>
            }
          />
          <Route
            path="/price-alerts"
            element={
              <PrivateRoute>
                <PriceAlerts />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <PrivateRoute>
                <div className="grid-container">
                  <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
                  <div className="main-content">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard searchQuery={searchQuery} />} />
                      <Route path="users" element={<Users searchQuery={searchQuery} />} />
                      <Route path="categories" element={<Categories searchQuery={searchQuery} />} />
                      <Route path="platforms" element={<Platforms searchQuery={searchQuery} />} />
                      <Route path="products" element={<Admin_Products searchQuery={searchQuery} />} />
                      <Route path="products/:id" element={<Admin_ProductDetails searchQuery={searchQuery} />} />
                      <Route path="scraper" element={<Scraper searchQuery={searchQuery} />} />
                    </Routes>
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </SearchProvider>
    
  );
}
export default App;


/*function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <SearchProvider>
    <Router>
      <div className="grid-container">
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/dashboard" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="/users" element={<Users  searchQuery={searchQuery} />} />
            <Route path="/categories" element={<Categories  searchQuery={searchQuery}/>} />
            <Route path="/products" element={<Admin_Products  searchQuery={searchQuery}/>} />
            <Route path="/products/:id" element={<Admin_ProductDetails  searchQuery={searchQuery}/>} />
            <Route path="/platforms" element={<Platforms  searchQuery={searchQuery}/>} />
            <Route path="/scraper" element={<Scraper />} />
          </Routes>
        </div>
      </div>
    </Router>
    </SearchProvider>
  );
}

export default App;*/