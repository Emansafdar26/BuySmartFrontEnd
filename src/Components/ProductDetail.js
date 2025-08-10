import React, { useState, useEffect } from 'react';
import '../Styles/ProductDetail.css';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';
import { apiGet } from "../lib/apiwrapper";
import { useParams } from 'react-router-dom';
import { FaFilter } from 'react-icons/fa';
import darazLogo from '../Assets/daraz.webp';
import ebayLogo from '../Assets/ebay.png';
import homeShoppingLogo from '../Assets/HomeShopping.jpeg';
import MainHeader from './MainHeader';
import Navbar from './Navbar';
import Footer from './Footer';

const platforms = [
  { name: 'Daraz', logo: darazLogo, price: 49999, url: 'https://www.daraz.pk/', image: 'https://static-01.daraz.pk/p/abc123.jpg' },
  { name: 'eBay', logo: ebayLogo, price: 52000, url: 'https://www.ebay.com/', image: '' },
  { name: 'HomeShopping', logo: homeShoppingLogo, price: 50500, url: 'https://homeshopping.pk/', image: '' },
];

const ProductDetail = () => {
  const  { id }  = useParams(); // Get id from URL params

  const [filteredPlatforms, setFilteredPlatforms] = useState(platforms);
  const [isFavourite, setIsFavourite] = useState(false);
  const [priceAlert, setPriceAlert] = useState(null);
  const [sortOption, setSortOption] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertInput, setAlertInput] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState(null);

  const productImage = platforms.find(p => p.image)?.image || 'https://via.placeholder.com/250x150?text=No+Image';

  // Fetch price history from API when id changes
  useEffect(() => {
    if (!id) {
      setLoadingHistory(false);
      setPriceHistory([]);
      return;
    }
     apiGet(`/products/${id}/price-history`)
      .then((res) => {
        if (res.detail && res.detail.code === 1) {
          setPriceHistory(res.detail.data);
        } else {
          setPriceHistory([]);
          setError(res.detail?.error || "Failed to fetch price history");
        }
      })
      .catch((err) => {
        setPriceHistory([]);
        setError("Error fetching price history");
        console.error(err);
      })
      .finally(() => {
        setLoadingHistory(false);
      });

    setLoadingHistory(true);
    setError(null);


  }, [id]);

  // Sorting logic
  useEffect(() => {
    const sorted = [...platforms];
    switch (sortOption) {
      case 'priceAsc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'platformAsc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'platformDesc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilteredPlatforms(sorted);
  }, [sortOption]);

  const toggleSortDropdown = () => setShowSortDropdown(prev => !prev);

  const handleFavouriteToggle = () => {
    setIsFavourite(prev => !prev);
    setModalContent(isFavourite ? 'Removed from Favourites' : 'Added to Favourites');
    setShowModal(true);
  };

  const handleSetPriceAlert = () => setShowAlertModal(true);

  const submitPriceAlert = () => {
    const price = parseInt(alertInput);
    if (!isNaN(price)) {
      setPriceAlert(price);
      setModalContent(`Price alert set at Rs ${price.toLocaleString()}`);
    } else {
      setModalContent('Invalid price entered!');
    }
    setShowAlertModal(false);
    setShowModal(true);
    setAlertInput('');
  };

  return (
    <>
      <MainHeader />
      <Navbar />

      {/* Modal for favourite/alert messages */}
      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{modalContent}</p>
            <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      {/* Modal for setting price alert */}
      {showAlertModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <h3>Set Price Alert</h3>
            <input
              type="number"
              value={alertInput}
              onChange={(e) => setAlertInput(e.target.value)}
              placeholder="Enter target price"
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <div className="modal-buttons">
              <button onClick={submitPriceAlert} className="modal-btn">Set Alert</button>
              <button onClick={() => setShowAlertModal(false)} className="modal-close-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Product detail and chart section */}
      <main className="product-details-container">
        <div className="product-info">
          <img src={productImage} alt="Product" className="product-detail-image" />
          <h2>Samsung 4K Smart TV</h2>
          <div className="product-icons">
            <span title="Add to Favourites" onClick={handleFavouriteToggle}>
              {isFavourite ? '❤️' : '🤍'}
            </span>
            <span title="Set Price Alert" onClick={handleSetPriceAlert}>
              {priceAlert ? '🔔' : '🔕'}
            </span>
          </div>
          {priceAlert && (
            <p className="alert-text">📢 Price alert set at Rs {priceAlert.toLocaleString()}</p>
          )}
        </div>

        <div className="chart-section">
          <h3 className="chart-title">Price History</h3>
          <div className="price-chart">
            {loadingHistory ? (
              <p>Loading price history...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : priceHistory.length === 0 ? (
              <p>No price history available.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>

      {/* Comparison Section */}
      <section className="comparison-bottom-section">
        <div className="filter-row">
          <span title="Sort" className="filter-icon" onClick={toggleSortDropdown}><FaFilter /></span>
          {showSortDropdown && (
            <div className="sort-dropdown">
              <button onClick={() => setSortOption('priceAsc')}>Price: Low to High</button>
              <button onClick={() => setSortOption('priceDesc')}>Price: High to Low</button>
              <button onClick={() => setSortOption('platformAsc')}>Platform: A-Z</button>
              <button onClick={() => setSortOption('platformDesc')}>Platform: Z-A</button>
            </div>
          )}
        </div>

        <h3 className="compare-title">Compare Prices</h3>

        <div className="price-cards">
          {filteredPlatforms.length > 0 ? (
            filteredPlatforms.map((platform) => (
              <div key={platform.name} className="price-card">
                <img src={platform.logo} alt={`${platform.name} logo`} />
                <div className="platform-details">
                  <span className="platform-name">{platform.name}</span>
                  <span className="platform-price">Rs {platform.price.toLocaleString()}</span>
                </div>
                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="visit-btn">Visit</a>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No results found.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductDetail;
 