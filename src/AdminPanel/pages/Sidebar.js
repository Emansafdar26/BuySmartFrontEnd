import React from "react";
import { NavLink } from "react-router-dom";
import { BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsBoxArrowRight, BsShop, BsGlobe, BsGearFill, BsChatSquareText } from "react-icons/bs";
function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    window.location.href = "/login";
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
            <BsGrid1X2Fill className="icon" /> Dashboard
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
            <BsPeopleFill className="icon" />Manage Users
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? "active" : ""}>
            <BsFillArchiveFill className="icon" />Manage Products
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "active" : ""}>
            <BsFillGrid3X3GapFill className="icon" />Manage Categories
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/platforms" className={({ isActive }) => isActive ? "active" : ""}>
            <BsShop className="icon" />Manage Platforms
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/feedback-page" className={({ isActive }) => isActive ? "active" : ""}>
            <BsChatSquareText className="icon" />User Feedback
          </NavLink>
        </li>
        <li className="sidebar-list-item">
          <NavLink to="/admin/scraper" className={({ isActive }) => isActive ? "active" : ""}>
            <BsGearFill className="icon" />Manage Scraper
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
export default Sidebar;
