import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/Navbar.css';
import CategoryDropdown from './CategoryDropdown';

const Navbar = () => {
  const [showCategories, setShowCategories] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".categories-menu")) {
        setShowCategories(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <NavLink exact="true" to="/" activeclassname="active">Home</NavLink>
        </li>
        <li className="categories-menu">
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={(e) => {
              e.preventDefault(); 
              setShowCategories((prev) => !prev);
            }}
          >
            Categories
          </NavLink>
          {showCategories && <CategoryDropdown />}
        </li>

        <li>
          <NavLink to="/Products" activeclassname="active">Products</NavLink>
        </li>
        <li>
          <NavLink to="/favourites" activeclassname="active">Favourites</NavLink>
        </li>
        <li>
          <NavLink to="/price-alerts" activeclassname="active">Price Alerts</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;