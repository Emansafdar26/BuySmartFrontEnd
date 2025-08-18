import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { apiGet } from "../lib/apiwrapper";
import "../Styles/CategoryPage.css";

// Breadcrumb formatter
const formatBreadcrumb = (text) => {
  if (!text) return "";
  return text
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [subcategoryTitle, setSubCategoryTitle] = useState("");
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  // Helper to route images through FastAPI proxy
  const proxyImage = (url) =>
    `http://localhost:8000/image-proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    getCategories();
    getProductsByCategory();
  }, [category, subcategory]);

  const getCategories = () => {
    apiGet("/categories")
      .then((res) => {
        if (res.detail?.code === 1 && res.detail.data) {
          setCategories(res.detail.data);
          const cat = res.detail.data.find((x) => x.id == category);
          if (cat) setCategoryTitle(cat.name);

          if (subcategory && cat) {
            const subcat = cat.subcategories.find((x) => x.id == subcategory);
            if (subcat) setSubCategoryTitle(subcat.name);
          } else {
            setSubCategoryTitle("");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getProductsByCategory = () => {
    if (!category) return;
    let route = "/productsbycategory/" + category;
    if (subcategory) {
      route += "?subcategory_id=" + subcategory;
    }
    apiGet(route)
      .then((res) => {
        if (res.detail?.code === 1 && res.detail.data) {
          // Proxy product images
          const proxiedProducts = res.detail.data.map((p) => ({
            ...p,
            image_url: proxyImage(p.image_url),
          }));
          setAllProducts(proxiedProducts);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSearch = (path) => {
    if (path.includes("categor")) {
      navigate("/products");
    }
  };

  // ===== Breadcrumb =====
  const breadcrumb = (
    <div className="breadcrumb">
      <Link to="/">Home</Link> &gt;{" "}
      <Link to="/categories">Categories</Link>
      {category && !subcategory && (
        <> &gt; <span className="active">{categoryTitle}</span></>
      )}
      {category && subcategory && (
        <>
          &gt; <Link to={`/category/${category}`}>{categoryTitle}</Link>
          &gt; <span className="active">{subcategoryTitle}</span>
        </>
      )}
    </div>
  );

  // ===== Content =====
  let content;

  if (!category && !subcategory) {
    // All Categories
    content = (
      <div className="category-container">
        <div className="category-header">
          <h2>All Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-card">
              {/* Category Image with proxy */}
              <img
                src={proxyImage(cat.image_url)}
                alt={cat.name}
                className="category-card-image"
              />

              {/* Category Title */}
              <Link to={`/category/${cat.id}`} className="category-title-link">
                <h3>{cat.name}</h3>
              </Link>

              {/* Subcategories List */}
              <ul className="subcategory-list">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <Link to={`/category/${cat.id}/${sub.id}`}>
                        {sub.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="no-subcategories">No subcategories</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (category) {
    content = (
      <div>
        <div className="category-header">
          <h2>
            {categoryTitle +
              (subcategoryTitle ? " / " + subcategoryTitle : "")}
          </h2>
        </div>
        <div className="category-grid">
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found in this subcategory.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <Navbar />
      <div className="category-page">
        {breadcrumb}
        {content}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
