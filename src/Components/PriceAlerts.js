import React, { useEffect, useState } from 'react';
import '../Styles/PriceAlerts.css';
import RemoveConfirmationModal from './RemoveConfirmationModal';
import { BsBellFill, BsFillCheckCircleFill } from 'react-icons/bs';
import { useSearch } from "../AdminPanel/context/SearchContext";
import MainHeader from './MainHeader';
import Navbar from './Navbar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { apiGet, apiPost } from '../lib/apiwrapper'; // your helper to call backend APIs

const PriceAlerts = () => {
  const { searchQuery } = useSearch();
  const [alerts, setAlerts] = useState([]);
  
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showChangePriceModal, setShowChangePriceModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [newTargetPrice, setNewTargetPrice] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Fetch price alerts on mount
  useEffect(() => {
    apiGet('/products/favorites/price-alerts')
      .then(res => {
        if (res.detail && res.detail.code === 1) {
          setAlerts(res.detail.data.map(item => ({
            favorite_id: item.favorite_id, 
            product_id: item.id, 
            id: item.id,
            title: item.title,
            image: item.image,
            currentPrice: item.current_price,
            targetPrice: item.target_price,
          })));
        } else {
          setAlerts([]);
          if(res.detail?.error){
            setModalMessage(res.detail.error);
            setShowMessageModal(true);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching price alerts:", err);
        setModalMessage("Failed to load price alerts.");
        setShowMessageModal(true);
      });
  }, []);

  // Filter alerts by search query
  const filteredAlerts = alerts.filter(alert =>
    alert.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Remove alert modal open
  const handleBellClick = (alert) => {
    setSelectedAlert(alert);
    setShowRemoveModal(true);
  };

  // Confirm remove price alert API call
  const confirmRemove = () => {
    apiPost('/products/favorites/remove-price-alert', { 
      favorite_id: selectedAlert.product_id  })
      .then(res => {
        if (res.resp && res.resp.code === 1) {
          setAlerts(prev => prev.filter(a => a.favorite_id !== selectedAlert.favorite_id));
          setModalMessage("Removed from Price Alerts");
        } else {
          setModalMessage(res.resp.error || "Failed to remove price alert");
        }
        setShowMessageModal(true);
        setShowRemoveModal(false);
        setSelectedAlert(null);
      })
      .catch(err => {
        console.error("Error removing price alert:", err);
        setModalMessage("Error removing price alert");
        setShowMessageModal(true);
      });
  };

  const cancelRemove = () => {
    setShowRemoveModal(false);
    setSelectedAlert(null);
  };

  // Open modal for changing target price
  const handleChangeTargetPrice = (alert) => {
    setSelectedAlert(alert);
    setNewTargetPrice(alert.targetPrice);
    setShowChangePriceModal(true);
  };

  // Submit new target price API call
  const submitNewTargetPrice = () => {
    const price = parseInt(newTargetPrice);
    if (isNaN(price) || price <= 0) {
      setModalMessage("Invalid value entered!");
      setShowMessageModal(true);
      setShowChangePriceModal(false);
      return;
    }

    apiPost('/products/favorites/update-price-alert', {
      favorite_id: selectedAlert.product_id,
      price_alert: price
    })
      .then(res => {
        if (res.resp && res.resp.code === 1) {
          setAlerts(prev =>
            prev.map(item =>
              item.favorite_id === selectedAlert.favorite_id
                ? { ...item, targetPrice: price }
                : item
            )
          );
          setModalMessage(res.resp.message || `Target price updated to Rs ${price.toLocaleString()}`);
        } else {
          setModalMessage(res.resp.error || "Failed to update price alert");
        }
        setShowMessageModal(true);
        setShowChangePriceModal(false);
        setSelectedAlert(null);
        setNewTargetPrice('');
      })
      .catch(err => {
        console.error("Error updating price alert:", err);
        setModalMessage("Error updating price alert");
        setShowMessageModal(true);
      });
  };

  return (
    <>
      <MainHeader />
      <Navbar />
      {showMessageModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setShowMessageModal(false)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      <div className="alerts-container">
        <h2 className="alerts-title">Price Alerts</h2>

        {filteredAlerts.length === 0 ? (
          <p className="empty-text">No price alerts match your search.</p>
        ) : (
          <div className="favourites-grid">
            {filteredAlerts.map(alert => {
              const targetReached = alert.currentPrice <= alert.targetPrice;
              return (
                <div key={alert.favorite_id} className="favourite-card">
                  <span 
                    className="heart-icon" 
                    onClick={() => handleBellClick(alert)}
                  >
                    <BsBellFill color="#f1a900ff" size={22} /> 
                  </span>

                  <img src={alert.image} alt={alert.title} className="favourite-img" />
                  <h3 className="product-title">{alert.title?.slice(0,50)}</h3>
                  <div className="price-details">
                    <span className="new-price">
                      Current: Rs {alert.currentPrice.toLocaleString()}
                    </span>
                  </div>
                  <p className="alert-text">
                    Target Price: Rs {alert.targetPrice.toLocaleString()}
                  </p>

                  {targetReached && (
                    <div className="target-reached-badge">
                      <BsFillCheckCircleFill className="target-reached-icon" />
                      Target Price Reached
                    </div>
                  )}

                  <div className="favourite-actions">
                    <Link to={`/product/${alert.id}`} className="compare-btn">
                      Compare Prices
                    </Link>
                    <button
                      className="alert-btn"
                      onClick={() => handleChangeTargetPrice(alert)}
                    >
                      Change Target Price
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Remove Confirmation Modal */}
        {showRemoveModal && selectedAlert && (
          <RemoveConfirmationModal
            product={selectedAlert}
            pageName="Price Alerts"
            onConfirm={confirmRemove}
            onCancel={cancelRemove}
          />
        )}

        {/* Change Target Price Modal */}
        {showChangePriceModal && selectedAlert && (
          <div className="priceAlert-modal">
            <div className="priceAlert-modal-content">
              <h3>Change Target Price</h3>
              <input
                type="number"
                value={newTargetPrice}
                onChange={(e) => setNewTargetPrice(e.target.value)}
                placeholder="Enter new target price"
                min="1"
              />
              <div className="priceAlert-modal-buttons">
                <button onClick={submitNewTargetPrice} className="modal-btn">Save</button>
                <button onClick={() => setShowChangePriceModal(false)} className="modal-close-btn">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PriceAlerts;
