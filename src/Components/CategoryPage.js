import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Carousel from "./Carousel";
import ProductCard from "./ProductCard";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { apiGet } from '../lib/apiwrapper';
import "../Styles/CategoryPage.css";
import { FaSortDown } from "react-icons/fa";

const CategoryPage = () => {
  const { category, subcategory } = useParams();
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [subcategoryTitle, setSubCategoryTitle] = useState("");
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("priceAsc");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const PRODUCTS_PER_PAGE = 48;
  const [currentPage, setCurrentPage] = useState(1);

  const proxyImage = (url) => `http://localhost:8000/image-proxy?url=${encodeURIComponent(url)}`;

  useEffect(() => {
    getCategories();
    getProductsByCategory();
  }, [category, subcategory]);

  const getCategories = () => {
    apiGet('/categories')
      .then((res) => {
        if (res.detail?.code === 1 && res.detail.data) {
          setCategories(res.detail.data);
          const cat = res.detail.data.find((x) => x.id == category);
          if (cat) setCategoryTitle(cat.name);

          if (subcategory && cat) {
            const subcat = cat.subcategories.find((x) => x.id == subcategory);
            if (subcat) setSubCategoryTitle(subcat.name);
          } else {
            setSubCategoryTitle('');
          }
        }
      })
      .catch(console.error);
  };

  const getProductsByCategory = () => {
    if (!category) return;
    let route = '/productsbycategory/' + category;
    if (subcategory) route += '?subcategory_id=' + subcategory;
    apiGet(route)
      .then((res) => {
        if (res.detail?.code === 1 && res.detail.data) {
          const proxiedProducts = res.detail.data.map(p => ({
            ...p,
            image_url: proxyImage(p.image_url)
          }));
          setAllProducts(proxiedProducts);
        }
      })
      .catch(console.error);
  };

  const toggleSortDropdown = () => setShowSortDropdown(prev => !prev);

  const handleMinPriceChange = (e) => {
    const val = e.target.value;
    if (val === "" || parseFloat(val) >= 0) setMinPrice(val);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (e) => {
    const val = e.target.value;
    if (val === "" || parseFloat(val) >= 0) setMaxPrice(val);
    setCurrentPage(1);
  };

  useEffect(() => {
    let filtered = [...allProducts];
    if (minPrice) filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice) filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));

    switch (sortOption) {
      case "priceAsc": filtered.sort((a, b) => a.price - b.price); break;
      case "priceDesc": filtered.sort((a, b) => b.price - a.price); break;
      case "name-a-z": filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-z-a": filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, minPrice, maxPrice, sortOption]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const currentProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);
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

  let content;
  if (!category && !subcategory) {
    content = (
      <div className="category-container">
        <div className="category-header">
          <h2>All Categories</h2>
        </div>
        <div className="category-grid">
          {categories.map((cat, idx) => (
            <div key={idx} className="category-card">
              <img src={proxyImage(cat.image_url)} alt={cat.name} className="category-card-image"/>
              <Link to={`/category/${cat.id}`} className="category-title-link">
                <h3>{cat.name}</h3>
              </Link>
              <ul className="subcategory-list">
                {cat.subcategories && cat.subcategories.length > 0 ? (
                  cat.subcategories.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <Link to={`/category/${cat.id}/${sub.id}`}>{sub.name}</Link>
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
  } else {
    content = (
      <div>
        <div className="category-header">
          <h2>{categoryTitle + (subcategoryTitle ? ' / ' + subcategoryTitle : '')}</h2>
        </div>
        <div>
          <div className="price-filter" style={{marginLeft:"60px", marginBottom:"-40px"}}>
            <label>Filter by Price:</label>
            <input type="number" placeholder="Min" value={minPrice} onChange={handleMinPriceChange} />
            <input type="number" placeholder="Max" value={maxPrice} onChange={handleMaxPriceChange} />
          </div>

          <div className="product-filter-row" ref={dropdownRef} style={{marginRight:"70px"}}>
            <button className="product-sort-btn" onClick={toggleSortDropdown} style={{marginBottom:"40px"}}>
              Sort Options
              <FaSortDown className={`sort-icon ${showSortDropdown ? "open" : ""}`} />
            </button>
            {showSortDropdown && (
              <div className="product-sort-dropdown">
                <button onClick={() => setSortOption("priceAsc")}>Price: Low to High</button>
                <button onClick={() => setSortOption("priceDesc")}>Price: High to Low</button>
                <button onClick={() => setSortOption("name-a-z")}>Name: A to Z</button>
                <button onClick={() => setSortOption("name-z-a")}>Name: Z to A</button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="category-grid">
          {currentProducts.length > 0 ? (
            currentProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Header onSearch={() => navigate('/products')} />
      <Navbar />
      <Carousel/>
      <div className="category-page">
        {breadcrumb}
        {content}
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
