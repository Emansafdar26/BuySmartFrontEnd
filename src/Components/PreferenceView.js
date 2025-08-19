import { useSearch } from "../AdminPanel/context/SearchContext";
import Header from "./MainHeader";
import Footer from "./Footer";
import ProductCard from "../Components/ProductCard";
import "../Styles/Products.css";
import { apiPost } from '../lib/apiwrapper';
import React, { useState, useEffect } from "react";

const PreferdProducts = () => {
  const { searchQuery } = useSearch()
  const [allProducts, setProducts] = useState([]);

  const getPrefferedProducts = () => {
    apiPost('/products/preffered', { name: searchQuery }).then((res) => {
        if (res.detail.code === 1) {
          setProducts(res.detail.data)
      } 
    })
      .catch((err) => {
        console.log("API error while fetching products:", err)
      })
  }
  const handleSearch = (route) => {
    if (route.toLowerCase() === '/preferenceview') {
        getPrefferedProducts()
    }
  }

  useEffect(() => {
   getPrefferedProducts()
  }, []);

  return (
    <>
      <Header onSearch={handleSearch} />
      <main className="product-container">
        <div className="product-header">
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

export default PreferdProducts;