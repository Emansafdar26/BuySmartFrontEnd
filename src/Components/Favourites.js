import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSearch } from "../AdminPanel/context/SearchContext"; 
import '../Styles/Favourites.css';
import MainHeader from './MainHeader';
import Navbar from './Navbar';
import Footer from './Footer';
import RemoveConfirmationModal from './RemoveConfirmationModal'; 
import { BsHeart, BsHeartFill, BsBell, BsBellFill } from "react-icons/bs";
import { apiGet, apiPost } from '../lib/apiwrapper';

const Favourites = () => {
  const { searchQuery } = useSearch(); 
  const [favourites, setFavourites] = useState([]);
  const [alertInput, setAlertInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { search } = useParams();

  // Fetch all favourites from backend once component mounts
  useEffect(() => {
    getFavoriteProducts({})

  }, []);

  const getFavoriteProducts = (data) => {
        apiPost('/products/favorites/all', data)
      .then(res => {
        if (res.detail && res.detail.code === 1) {
          setFavourites(res.detail.data.map(item => ({
            favorite_id: item.favorite_id,  
            id: item.id,                  
            title: item.title,
            image: item.image,
            price: item.price,
            priceAlert: item.price_alert,
            isFavourite: true 
          })));
        } else {
          setFavourites([]);
        }
      })
      .catch(err => {
        console.error("Error fetching favourites:", err);
      });
  }
  const filteredFavourites = favourites.filter(product =>
    product.isFavourite && product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const isSearchActive = searchQuery.trim() !== "";

  // Remove from favourites API (uses product_id)
  const confirmRemove = () => {
    apiPost('/products/removefavorite', { product_id: selectedProduct.id })
      .then(res => {
        if (res.resp && res.resp.code === 1) {
          setFavourites(prev =>
            prev.map(item =>
              item.id === selectedProduct.id
                ? { ...item, isFavourite: false }
                : item
            )
          );
          setModalMessage("Removed from favourites");
        } else {
          setModalMessage(res.resp.error || "Failed to remove favourite");
        }
        setShowMessageModal(true);
        setShowRemoveModal(false);
        setSelectedProduct(null);
      })
      .catch(err => {
        console.error("Error removing favourite:", err);
      });
  };

  const handleHeartClick = (product) => {
    setSelectedProduct(product);
    setShowRemoveModal(true);
  };

  const handleSearch = (route) => {
    if (route === '/favourites') {
      getFavoriteProducts({ searchQuery })
    }
  }

  // Set price alert API (uses favorite_id)
  const submitPriceAlert = () => {
    const price = parseInt(alertInput);

    if (isNaN(price) || price <= 0) {
      setShowAlertModal(false);
      setModalMessage('Invalid value entered!');
      setShowMessageModal(true);
      return;
    }

    apiPost('/products/favorites/set-price-alert', {
        product_id: selectedProduct.id,  
        price_alert: price
      })
      .then(res => {
        if (res.detail && res.detail.code === 1) {
          setFavourites(prev =>
            prev.map(item =>
              item.id === selectedProduct.id 
                ? { ...item, priceAlert: price }
                : item
            )
          );
          setModalMessage(`Price alert set at Rs ${price.toLocaleString()}`);
        } else {
          setModalMessage(res.detail.error || "Failed to set price alert");
        }
        setAlertInput('');
        setShowAlertModal(false);
        setShowMessageModal(true);
      })
      .catch(err => {
        console.error("Error setting price alert:", err);
      });
  };

  return (
    <>
      <MainHeader onSearch={handleSearch} />
      <Navbar />

      {/* Message Modal */}
      {showMessageModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowMessageModal(false)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Price Alert Modal */}
      {showAlertModal && (
        <div className="priceAlert-modal">
          <div className="priceAlert-modal-content">
            <h3>Set Price Alert</h3>
            <input
              type="number"
              value={alertInput}
              onChange={(e) => setAlertInput(e.target.value)}
              placeholder="Enter target price"
              min="1"
            />
            <div className="priceAlert-modal-buttons">
              <button onClick={submitPriceAlert} className="modal-btn">Save Alert</button>
              <button onClick={() => setShowAlertModal(false)} className="modal-close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveModal && selectedProduct && (
        <RemoveConfirmationModal
          product={selectedProduct}
          pageName="Favourites"
          onConfirm={confirmRemove}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}

      <div className="favourites-container">
        <h2 className="favourites-title"> Your Favourites</h2>

        {filteredFavourites.length === 0 && !isSearchActive ? (
          <p className="empty-text">You haven’t added any products yet.</p>
        ) : filteredFavourites.length === 0 && isSearchActive ? (
          <p className="empty-text">No products match your search.</p>
        ) : (
          <div className="favourites-grid">
            {filteredFavourites.map(product => (
              <div key={product.favorite_id} className="favourite-card">
                <span 
                  className="heart-icon" 
                  onClick={() => handleHeartClick(product)}
                >
                  {product.isFavourite ? <BsHeartFill color="red" size={22} /> : <BsHeart size={22} />}
                </span>

                <img src={product.image} alt={product.title} className="favourite-img" />
                <h3 className="product-title">{product.title?.slice(0,50)}</h3>

                {product.price && (
                  <div className="price-details">
                    <span className="new-price">Rs {product.price.toLocaleString()}</span>
                  </div>
                )}

                {product.priceAlert && (
                  <p className="alert-text">
                    Price alert set at Rs {product.priceAlert.toLocaleString()}
                  </p>
                )}

                <div className="favourite-actions">
                  <Link to={`/product/${product.id}`} className="compare-btn">
                    Compare Prices
                  </Link>
                  <button
                    className="alert-btn"
                    onClick={() => {
                      setSelectedProduct(product);
                      setAlertInput(product.priceAlert || '');
                      setShowAlertModal(true);
                    }}
                  >
                    {product.priceAlert ? <BsBellFill size={18} /> : <BsBell size={18} />} Set Alert
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Favourites;
