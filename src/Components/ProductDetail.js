import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSearch } from "../AdminPanel/context/SearchContext";
import '../Styles/ProductDetail.css';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Header from './MainHeader';
import Navbar from './Navbar';
import Footer from './Footer';
import { BsHeart, BsHeartFill } from 'react-icons/bs';
import { FaSortDown } from 'react-icons/fa';
import { apiGet, apiPost } from '../lib/apiwrapper';
import dayjs from 'dayjs';

const ProductDetail = () => {
  const { id } = useParams();
  const { searchQuery } = useSearch();
  const [platforms, setPlatforms] = useState([]);
  const [filteredPlatforms, setFilteredPlatforms] = useState([]);
  const navigate = useNavigate();
  const [isFavourite, setIsFavourite] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [productInfo, setProductInfo] = useState(null);
  const [error, setError] = useState(null);

  const dropdownRef = useRef(null);

  // ✅ Image proxy helper
  const proxyImage = (url) => `http://localhost:8000/image-proxy?url=${encodeURIComponent(url)}`;

  // ✅ Fetch if product is already favorited
  useEffect(() => {
    if (!id) return;
    apiGet(`/products/${id}/isfavorite`)
      .then(res => {
        if (res.resp?.code === 1) setIsFavourite(res.resp.is_favorite);
      })
      .catch(err => console.error("Error checking favorite status", err));
  }, [id]);

  const handleFavouriteToggle = () => {
    apiPost("/products/togglefavorite", { product_id: Number(id) })
      .then(res => {
        if (res.resp?.code === 1) {
          setIsFavourite(res.resp.status === "added");
          setModalContent(res.resp.message);
          setShowModal(true);
        } else {
          setModalContent(res.resp?.error || "Failed to update favorite");
          setShowModal(true);
        }
      })
      .catch(err => {
        console.error("Error toggling favorite", err);
        setModalContent("An error occurred.");
        setShowModal(true);
      });
  };

  // ✅ Related products fetch
  useEffect(() => {
    if (!id) return;
    apiGet(`/products/${id}/related`)
      .then((res) => {
        if (res.detail && res.detail.code === 1) {
          const related = res.detail.data.map(p => ({
            name: p.platform_name || 'Unknown',
            logo: proxyImage(p.image), // use proxy
            productName: p.name,
            price: p.price,
            productUrl: `/product/${p.id}`,
            platform_website: p.platform_website || '#'
          }));
          setPlatforms(related);
          setFilteredPlatforms(related);
        } else {
          setPlatforms([]);
          setFilteredPlatforms([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching related products", err);
        setPlatforms([]);
        setFilteredPlatforms([]);
      });
  }, [id]);

  const handleSearch = (path) => {
    if (path.includes("product")) navigate('/products');
  };

  // ✅ Price history fetch
  useEffect(() => {
    if (!id) {
      setLoadingHistory(false);
      setPriceHistory([]);
      return;
    }
    setLoadingHistory(true);
    setError(null);
    apiGet(`/products/${id}/price-history`)
      .then((res) => {
        if (res.detail && res.detail.code === 1) {
          const formattedData = res.detail.data.map(item => ({
            date: dayjs(item.date).format("MMM"),
            price: item.price
          }));
          setPriceHistory(formattedData);
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
      .finally(() => setLoadingHistory(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    apiGet(`/products/${id}`)
      .then(res => {
        if (res.detail?.code === 1 && res.detail.data) {
          setProductInfo({
            ...res.detail.data,
            image: proxyImage(res.detail.data.image)
          });
        } else {
          setProductInfo(null);
        }
      })
      .catch(err => {
        console.error("Error fetching product info", err);
        setProductInfo(null);
      });
  }, [id]);

  useEffect(() => {
    const sorted = [...platforms];
    switch (sortOption) {
      case 'priceAsc': sorted.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': sorted.sort((a, b) => b.price - a.price); break;
      case 'platformAsc': sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'platformDesc': sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    setFilteredPlatforms(sorted);
  }, [sortOption, platforms]);

  const toggleSortDropdown = () => setShowSortDropdown(prev => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const productImage = productInfo?.image || '';
  const currentPrice = priceHistory.length > 0
    ? priceHistory[priceHistory.length - 1].price
    : productInfo?.price || 0;
  const currentPlatform = productInfo?.platform_name || '';

  return (
    <>
      <Header onSearch={handleSearch} />
      <Navbar />

      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{modalContent}</p>
            <button onClick={() => setShowModal(false)} className="modal-close-btn">Close</button>
          </div>
        </div>
      )}

      <main className="product-details-container">
        <div className="product-info">
          <span className="favourite-icon" onClick={handleFavouriteToggle}>
            {isFavourite ? <BsHeartFill color="red" size={22} /> : <BsHeart size={22} />}
          </span>

          {productInfo?.image && (
            <img src={productInfo.image} alt={productInfo.name} className="product-detail-image" />
          )}
          <h2>{productInfo?.name || productInfo?.title || 'Product Name'}</h2>
          <p className="product-main-price">Rs {currentPrice.toLocaleString()}</p>
          <p className="product-main-platform">Platform: {currentPlatform}</p>
        </div>

        <div className="chart-section">
          <h3 className="chart-title">Monthly Price History</h3>
          <div className="price-chart">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={priceHistory}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ff7300" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" stroke="#000" />
                <YAxis stroke="#000" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="price" stroke="#ff7300" fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <section className="comparison-bottom-section">
        <div className="filter-row" ref={dropdownRef}>
          <button className="sort-btn" onClick={toggleSortDropdown}>
            Sort Options
            <FaSortDown className={`sort-icon ${showSortDropdown ? 'open' : ''}`} />
          </button>

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
            filteredPlatforms.map((platform, index) => (
              <div key={index} className="price-card">
                <img src={platform.logo} alt={platform.productName} className="comparison-product-img" />
                <div className='product-details-parent'>
                  <div className="platform-details">
                    <span className="platform-product-name">{platform.productName}</span>
                    <span className="platform-name">{platform.name}</span>
                  </div>
                  <div>
                    <span className="platform-price"> Rs {platform.price.toLocaleString()}</span>
                  </div>
                </div>
                <a href={platform.platform_website} target="_blank" rel="noopener noreferrer" className="visit-btn">
                  Visit
                </a>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center' }}>No related products found.</p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductDetail;
