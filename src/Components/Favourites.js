import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegTrashAlt, FaSearchDollar } from 'react-icons/fa';
import RemoveConfirmationModal from './RemoveConfirmationModal';
import '../Styles/Favourites.css';
import MainHeader from './MainHeader';
import Footer from './Footer';
import { apiGet, apiPost } from '../lib/apiwrapper';

const Favourites = () => {
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favourites, setFavourites] = useState([]);

  const handleRemoveClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const confirmRemove = () => {
    const data = {
      product_id: selectedProduct.id,
    };
  
    apiPost('/products/removefavorite', data)
      .then((res) => {
        console.log("Remove API response:", res); // Debugging
  
        if (res.resp) {
          if (res.resp.code === 1) {
            setShowModal(false);
            setSelectedProduct(null);
            window.location.reload();
            getFavoriteProducts();
          } else if (res.resp.code === 0) {
            setErrors({ products: res.resp.error });
          }
        } else {
          setErrors({ products: 'Unexpected response format.' });
        }
      })
      .catch((err) => {
        console.error("Error while removing favorite:", err);
        setErrors({ products: 'Something went wrong while removing product.' });
      });
  };
  
  const cancelRemove = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const getFavoriteProducts = () => {
    apiGet('/products/favorites/all')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1 && res.detail.data) {
            setFavourites(res.detail.data);
          } else if (res.detail.code === 0) {
            setErrors({ products: res.detail.error });
          }
        } else {
          setErrors({ products: 'Unexpected response format.' });
        }
      })
      .catch((err) => {
        console.log("API error while fetching products:", err);
        setErrors({ products: 'Something went wrong while fetching products.' });
      });
  };

  useEffect(() => {
    getFavoriteProducts();
  }, []);

  return (
    <>
      <MainHeader />
      <div className="favourites-container">
        <h2 className="favourites-title">❤️ Your Favourites</h2>

        {favourites.length === 0 ? (
          <p className="empty-text">You haven’t added any products yet.</p>
        ) : (
          <div className="favourites-grid">
            {favourites.map((product) => (
              <div key={product.id} className="favourite-card">
                <img src={product.image} alt={product.title} className="favourite-img" />
                <h3 className="product-title">{product.title}</h3>

                <div className="favourite-actions">
                  <Link to={`/product/${product.id}`} className="compare-btn">
                    <FaSearchDollar /> Compare Prices
                  </Link>
                  <button className="remove-btn" onClick={() => handleRemoveClick(product)}>
                    <FaRegTrashAlt /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedProduct && (
          <RemoveConfirmationModal
            product={selectedProduct}
            onConfirm={confirmRemove}
            onCancel={cancelRemove}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default Favourites;
