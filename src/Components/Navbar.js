import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><NavLink exact to="/" activeClassName="active">Home</NavLink></li>
        <li><NavLink to="/categories" activeClassName="active">Categories</NavLink></li>
        <li><NavLink to="/Products" activeClassName="active">Products</NavLink></li>
        <li><NavLink to="/favourites" activeClassName="active">Favourites</NavLink></li>
        <li><NavLink to="/price-alerts" activeClassName="active">PriceAlerts</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
