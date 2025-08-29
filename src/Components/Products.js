import { useSearch } from "../AdminPanel/context/SearchContext";
import Header from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Carousel from "./Carousel";
import ProductCard from "../Components/ProductCard";
import "../Styles/Products.css";
import { apiGet, apiPost } from '../lib/apiwrapper';
import React, { useState, useEffect, useRef } from "react";
import { FaSortDown } from "react-icons/fa";

const Products = () => {
  const { searchQuery } = useSearch();
  const [errors, setErrors] = useState({});
  const [allProducts, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const PRODUCTS_PER_PAGE = 48;

  // Fetch products
  const getProducts = () => {
    apiGet('/products')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1 && res.detail.data) {
            setProducts(res.detail.data);
          } else if (res.detail.code === 0) {
            setErrors({ products: res.detail.error });
          }
        } else {
          setErrors({ products: "Unexpected response format." });
        }
      })
      .catch((err) => {
        console.log("API error while fetching products:", err);
        setErrors({ products: "Something went wrong while fetching products." });
      });
  };

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

  // Search products by name
  const searchResults = () => {
    apiPost('/products/search', { name: searchQuery })
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1 && res.detail.data) {
            setProducts(res.detail.data);
            setCurrentPage(1);
          } else if (res.detail.code === 0) {
            setErrors({ products: res.detail.error });
          }
        } else {
          setErrors({ products: "Unexpected response format." });
        }
      })
      .catch((err) => {
        console.log("API error while fetching products:", err);
        setErrors({ products: "Something went wrong while fetching products." });
      });
  };

  const handleSearch = (route) => {
    if (route.toLowerCase() === '/products') {
      searchResults();
    }
  };

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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchResults();
    } else {
      getProducts();
    }
  }, [searchQuery]);

  // Apply filters
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
const toggleSortDropdown = () => setShowSortDropdown(prev => !prev);
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  return (
    <>
      <Header onSearch={handleSearch} />
      <Navbar />
      <Carousel/>
      <main className="product-container">
          <h2>All Products</h2>
        <div className="product-header">
          <div className="category-filter">
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

          <div className="price-filter">
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
                  <div className="product-filter-row" ref={dropdownRef}>
                    <button className="product-sort-btn" onClick={toggleSortDropdown}>
                      Sort Options
                      <FaSortDown className={`sort-icon ${showSortDropdown ? "open" : ""}`} />
                    </button>
                    {showSortDropdown && (
                      <div className="product-sort-dropdown">
                        <button onClick={() => setSortOption("priceAsc")}>
                          Price: Low to High
                        </button>
                        <button onClick={() => setSortOption("priceDesc")}>
                          Price: High to Low
                        </button>
                      </div>
                    )}
                  </div>
        </div>

        <div className="product-grid">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>

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
      <Footer />
    </>
  );
};

export default Products;
