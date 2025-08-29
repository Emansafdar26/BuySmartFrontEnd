import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./AdminPanel/AdminPanel.css";
import { SearchProvider } from "./AdminPanel/context/SearchContext";
import Sidebar from "./AdminPanel/pages/Sidebar";
import Dashboard from "./AdminPanel/pages/Dashboard";
import Users from "./AdminPanel/pages/Users";
import Categories from "./AdminPanel/pages/Categories";
import Admin_Products from "./AdminPanel/pages/Admin_Products";
import Platforms from "./AdminPanel/pages/Platform";
import Admin_ProductDetails from "./AdminPanel/pages/Admin_ProductDetails";
import FeedbackPage from "./AdminPanel/pages/FeedbackPage";
import Scraper from "./AdminPanel/pages/Scraper";
import Admin_Profile from "./AdminPanel/pages/Admin_Profile";
import Home from "./Components/Home";
import Products from "./Components/Products";
import SignUp from "./Components/SignUp";
import Login from "./Components/Login";
import VerifyOtp from "./Components/VerifyOTP";
import Profile from "./Components/Profile";
import ForgotPassword from "./Components/ForgotPassword";
import ProductDetail from "./Components/ProductDetail";
import CategoryPage from "./Components/CategoryPage";
import Favourites from "./Components/Favourites";
import PriceAlerts from "./Components/PriceAlerts";
import AboutUs from "./Components/AboutUs";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import TermsAndConditions from "./Components/TermsAndConditions";
import Contact from "./Components/Contact";
import PrivateRoute from "./Components/PrivateRoute";
import PublicRoute from "./Components/PublicRoute";
import Preferences from "./Components/Preferences";
import PreferenceView from "./Components/PreferenceView";
import ScrollToTop from "./Components/ScrollToTop";
import FeedbackButton from "./Components/FeedbackButton";
import AccountPage from "./Components/AccountPage";

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
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:search?" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/category/:category/:subcategory" element={<CategoryPage />} />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicRoute>
                <VerifyOtp />
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
            path="/favourites/:search?"
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
            path="/account"
            element={
              <PrivateRoute>
                <AccountPage />
              </PrivateRoute>
            }
          >
            <Route index element={<h2>Account Overview</h2>} />
            <Route path="profile" element={<Profile />} />
            <Route path="preferences" element={<Preferences />} />
            <Route path="personalized" element={<PreferenceView />} />
          </Route>

          {/* Admin Routes */}
<Route
  path="/admin/*"
  element={
    <PrivateRoute>
      <div className="grid-container">
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        <div className="admin-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard searchQuery={searchQuery} />} />
            <Route path="users" element={<Users searchQuery={searchQuery} />} />
            <Route path="categories" element={<Categories searchQuery={searchQuery} />} />
            <Route path="platforms" element={<Platforms searchQuery={searchQuery} />} />
            <Route path="products" element={<Admin_Products searchQuery={searchQuery} />} />
            <Route path="feedback-page" element={<FeedbackPage searchQuery={searchQuery} />} />
            <Route path="products/:id" element={<Admin_ProductDetails searchQuery={searchQuery} />} />
            <Route path="scraper" element={<Scraper searchQuery={searchQuery} />} />
            <Route path="admin-profile" element={<Admin_Profile />} />
          </Routes>
        </div>
      </div>
    </PrivateRoute>
  }
/>

        </Routes>
        <FeedbackButton />
      </Router>
    </SearchProvider>
  );
}

export default App;
