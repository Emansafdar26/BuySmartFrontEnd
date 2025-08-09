import React, { useState } from 'react';
import '../Styles/PriceAlerts.css';
import RemoveConfirmationModal from './RemoveConfirmationModal';
import { FaBell, FaRegTrashAlt } from 'react-icons/fa';
import MainHeader from './MainHeader';
import Footer from './Footer';

const dummyAlerts = [
  {
    id: 1,
    title: 'Samsung Galaxy S21',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/levant/galaxy-s21/gallery/levant-galaxy-s21-5g-g991-sm-g991bzvdmea-368327191?$1300_1038_PNG$',
    targetPrice: 100000,
    platforms: ['Daraz', 'eBay'],
  },
  {
    id: 2,
    title: 'iPhone 14 Pro Max',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-model-unselect-gallery-2-202209?wid=5120&hei=2880&fmt=jpeg&qlt=90&.v=1660753619946',
    targetPrice: 180000,
    platforms: ['HomeShopping'],
  },
];

const PriceAlerts = () => {
  const [alerts, setAlerts] = useState(dummyAlerts);
  const [showModal, setShowModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleRemoveClick = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
  };

  const confirmRemove = () => {
    setAlerts(alerts.filter(a => a.id !== selectedAlert.id));
    setShowModal(false);
    setSelectedAlert(null);
  };

  const cancelRemove = () => {
    setShowModal(false);
    setSelectedAlert(null);
  };

  return (
    <>
    <MainHeader/>
    <div className="alerts-container">
      <h2 className="alerts-title"><FaBell /> Price Alerts</h2>

      {alerts.length === 0 ? (
        <p className="empty-text">You have no active price alerts.</p>
      ) : (
        <div className="alerts-grid">
          {alerts.map(alert => (
            <div key={alert.id} className="alert-card">
              <img src={alert.image} alt={alert.title} className="alert-img" />
              <div className="alert-info">
                <h3>{alert.title}</h3>
                <p><strong>Target Price:</strong> Rs. {alert.targetPrice.toLocaleString()}</p>
                <p><strong>Tracking:</strong> {alert.platforms.join(', ')}</p>
              </div>
              <button className="remove-alert-btn" onClick={() => handleRemoveClick(alert)}>
                <FaRegTrashAlt /> Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedAlert && (
        <RemoveConfirmationModal
          product={selectedAlert}
          onConfirm={confirmRemove}
          onCancel={cancelRemove}
        />
      )}
      <Footer/>
    </div>
    </>
  );
};

export default PriceAlerts;
