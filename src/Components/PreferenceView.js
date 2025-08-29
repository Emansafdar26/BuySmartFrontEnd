import { useSearch } from "../AdminPanel/context/SearchContext";
import ProductCard from "../Components/ProductCard";
import "../Styles/Products.css";
import { apiGet } from '../lib/apiwrapper'; 
import React, { useState, useEffect, useRef } from "react";
import { FaSortDown } from "react-icons/fa";

const PreferdProducts = () => {
  const { searchQuery } = useSearch();
  const [allProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlistMessage, setWishlistMessage] = useState("");
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const dropdownRef = useRef(null);
  const PRODUCTS_PER_PAGE = 48;

  // Fetch categories
  const getCategories = () => {
    apiGet('/categories')
      .then((res) => {
        if (res.detail && res.detail.code === 1 && res.detail.data) {
          setCategories(res.detail.data);
        }
      })
      .catch((err) => {
        console.log("API error while fetching categories:", err);
      });
  };

  // Fetch preferred products
  const getPreferredProducts = () => {
    setLoading(true);
    setError("");
    apiGet('/products-by-preferences')
      .then((res) => {
        if (res.detail.code === 1) {
          setProducts(res.detail.data);
        } else {
          setProducts([]);
          setError(res.detail?.message || "No products found.");
        }
      })
      .catch((err) => {
        console.log("API error while fetching preferred products:", err);
        setError("Failed to fetch preferred products.");
      })
      .finally(() => setLoading(false));
  };

  // OnSearch handler
  const handleSearch = (route) => {
    if (route.toLowerCase() === '/preferenceview') {
      getPreferredProducts();
    }
  };

  // Filters
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setMinPrice(value);
      setCurrentPage(1);
    }
  };

  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setMaxPrice(value);
      setCurrentPage(1);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  const toggleSortDropdown = () => setShowSortDropdown(prev => !prev);

  // Wishlist modal handler
  const handleWishlistChange = (message) => {
    setWishlistMessage(message);
    setShowWishlistModal(true);
    setTimeout(() => setShowWishlistModal(false), 2000);
  };

  // Filtered & sorted products
  const filteredProducts = allProducts
    .filter(product => {
      const categoryMatch = selectedCategory ? product.category_id === parseInt(selectedCategory) : true;
      const minPriceMatch = minPrice ? product.price >= parseFloat(minPrice) : true;
      const maxPriceMatch = maxPrice ? product.price <= parseFloat(maxPrice) : true;
      return categoryMatch && minPriceMatch && maxPriceMatch;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "priceAsc":
          return a.price - b.price;
        case "priceDesc":
          return b.price - a.price;
        case "name-a-z":
          return a.name.localeCompare(b.name);
        case "name-z-a":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    getCategories();
    getPreferredProducts();
  }, []);

  return ( 
    <main onSearch={handleSearch}>
      <h2 style={{ textAlign: "center", marginBottom: "40px", marginTop: "40px", color:"#133c5b", fontSize: "28px", fontWeight: "700" }}>
        Products Matching Your Preferences
      </h2>

      <div className="product-header">
        <div className="category-filter" style={{marginTop:"30px"}}>
          <label htmlFor="category">Filter by Category: </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="price-filter" style={{marginTop:"30px"}}>
          <label>Price: </label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={handleMinPriceChange}
            min="0"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={handleMaxPriceChange}
            min="0"
          />
        </div>

        <div className="product-filter-row" ref={dropdownRef} style={{marginLeft:"280px", marginTop:"30px"}}>
          <button className="product-sort-btn" onClick={toggleSortDropdown}>
            Sort Options
            <FaSortDown className={`sort-icon ${showSortDropdown ? "open" : ""}`} />
          </button>

          {showSortDropdown && (
            <div className="product-sort-dropdown">
              <button onClick={() => handleSortChange("priceAsc")}>Price: Low to High</button>
              <button onClick={() => handleSortChange("priceDesc")}>Price: High to Low</button>
              <button onClick={() => handleSortChange("name-a-z")}>Name: A to Z</button>
              <button onClick={() => handleSortChange("name-z-a")}>Name: Z to A</button>
            </div>
          )}
        </div>
      </div>

      {loading && <p className="loading-text">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onWishlistChange={handleWishlistChange} 
            />
          ))
        ) : (
          !loading && !error && <p className="no-results">No products found.</p>
        )}
      </div>

      {showWishlistModal && (
        <div className="wishlist-modal">
          <p>{wishlistMessage}</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default PreferdProducts;
