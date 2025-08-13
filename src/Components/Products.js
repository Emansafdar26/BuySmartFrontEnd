import { useSearch } from "../AdminPanel/context/SearchContext";
import Header from "./MainHeader";
import Navbar from "./Navbar";
import { BsSearch } from "react-icons/bs";
import Footer from "./Footer";
import ProductCard from "../Components/ProductCard";
import "../Styles/Products.css";
import { apiGet, apiPost } from '../lib/apiwrapper';
import React, { useState, useEffect } from "react";

const Products = () => {
  const { searchQuery } = useSearch()
  const [errors, setErrors] = useState({});
  const [allProducts, setProducts] = useState([]);

  const searchResults = () => {
      apiPost('/products/search', { name: searchQuery })      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1 && res.detail.data) {
            setProducts(res.detail.data)
          } else if (res.detail.code === 0) {
            let newErrors = {}
            newErrors.products = res.detail.error
            setErrors(newErrors)
          }
        } else {
          let newErrors = {}
          newErrors.products = "Unexpected response format."
          setErrors(newErrors)
        }
      })
      .catch((err) => {
        console.log("API error while fetching products:", err)
        let newErrors = {}
        newErrors.products = "Something went wrong while fetching products."
        setErrors(newErrors)
      })
  }
    const handleSearch = (route) => {
    if (route === '/Products') {
      searchResults()
    }
  }
  const getProducts = () => {
    apiGet('/products')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1 && res.detail.data) {
            setProducts(res.detail.data)
          } else if (res.detail.code === 0) {
            let newErrors = {}
            newErrors.products = res.detail.error
            setErrors(newErrors)
          }
        } else {
          let newErrors = {}
          newErrors.products = "Unexpected response format."
          setErrors(newErrors)
        }
      })
      .catch((err) => {
        console.log("API error while fetching products:", err)
        let newErrors = {}
        newErrors.products = "Something went wrong while fetching products."
        setErrors(newErrors)
      })
  }


  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Header onSearch={handleSearch} />
      <Navbar />
      <main className="product-container">

    
        <div className="product-header">
          <h2>All Products</h2>
        </div>

        <div className="product-grid">
          {allProducts.length > 0 ? (
            allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Products;
