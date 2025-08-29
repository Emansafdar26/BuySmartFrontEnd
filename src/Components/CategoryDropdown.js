import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa"; 
import "../Styles/CategoryDropdown.css";
import { apiGet } from '../lib/apiwrapper'

const CategoryDropdown = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([])

  useEffect(() => {
    getCategories()
  }, [])

  const handleMouseEnter = (cat) => {
    setActiveCategory(cat.id);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setActiveCategory(null);
    }, 10000); // keep submenu open for 10 sec
  };

  const getCategories = () => {
    apiGet('/categories')
      .then((res) => {
        if (res.detail.code === 1) {
          if (res.detail.data) {
            setCategories(res.detail.data);
          }
        }
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <div className="category-dropdown">
      <div className="category-dropdown-menu">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="category-dropdown-item"
            onMouseEnter={() => handleMouseEnter(cat)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Category link */}
            <Link
              to={`/category/${cat.id}`}
              className="category-link"
            >
              {cat.name}
            </Link>

            <FaChevronRight
              className={`submenu-icon ${activeCategory === cat.id ? "rotated" : ""}`}
            />

            {/* Subcategories */}
            {activeCategory === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
  <div className="dropdown-submenu">
    {cat.subcategories.map((sub, index) => (
      <Link key={index} to={`/category/${cat.id}/${sub.id}`}>
        {sub.name}
      </Link>
    ))}
  </div>
)}

          </div>
        ))}

        {/* View All Categories */}
        <div className="view-all">
          <Link to="/categories">View All Categories</Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
