import React, { useState, useEffect } from "react";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { useNavigate, Link } from "react-router-dom";
import Header from "./MainHeader";
import Footer from "./Footer";
import "../Styles/Home.css";
import { apiGet } from "../lib/apiwrapper";

// Assets
import SmartTV3 from "../Assets/SmartTV3.jpg";
import Refrigrator from "../Assets/Refrigrator.jpeg";
import WashingMachine from "../Assets/WashingMachine.png";
import Kitchen from "../Assets/Kitchen.jpg";
import category_ac from "../Assets/category_ac.webp";

// ====== Helper: Image Proxy ======
const proxyImage = (url) =>
  url ? `http://localhost:8000/image-proxy?url=${encodeURIComponent(url)}` : "";

// ====== Carousel Images ======
const carouselImages = [
  { src: SmartTV3, caption: "Latest Smart TVs at the Best Prices" },
  {
    src: Refrigrator,
    caption: "Best Deals on Refrigerators – Stay Cool & Save Money!",
  },
  {
    src: WashingMachine,
    caption: "Top Washing Machines – Compare & Choose Smartly!",
  },
  {
    src: Kitchen,
    caption: "Kitchen Essentials – From Microwaves to Blenders!",
  },
  {
    src: category_ac,
    caption: "Beat the Heat with the Best ACs – Compare & Stay Cool!",
  },
];

// ====== Welcome Modal Slides ======
const modalSlides = [
  {
    title: "Compare Prices Instantly",
    text: "Find the best deals across multiple platforms with BuySmart!",
    image: SmartTV3,
  },
  {
    title: "Track Your Favorites",
    text: "Save products to your wishlist and never miss a price drop.",
    image: Refrigrator,
  },
  {
    title: "Get Real-Time Alerts",
    text: "Receive notifications whenever product prices change.",
    image: WashingMachine,
  },
  {
    title: "Shop Smart",
    text: "Make informed purchases and save more money with BuySmart.",
    image: Kitchen,
  },
];

const Home = () => {
  const { searchQuery } = useSearch();
  const navigate = useNavigate();

  // States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [categories, setCategories] = useState([]);
  const [trendingDeals, setTrendingDeals] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [errors, setErrors] = useState({});

  // ====== Carousel Controls ======
  const nextSlide = () =>
    setCurrentIndex((i) => (i + 1) % carouselImages.length);
  const prevSlide = () =>
    setCurrentIndex((i) => (i === 0 ? carouselImages.length - 1 : i - 1));

  // ====== Modal Controls ======
  const nextModal = () => setModalIndex((i) => (i + 1) % modalSlides.length);
  const prevModal = () =>
    setModalIndex((i) => (i === 0 ? modalSlides.length - 1 : i - 1));

  // ====== API Calls ======
  const fetchCategories = async () => {
    try {
      const res = await apiGet("/categories");
      if (res.detail?.code === 1) setCategories(res.detail.data || []);
    } catch {
      setErrors((e) => ({ ...e, categories: "Failed to fetch categories." }));
    }
  };

  const fetchTrendingDeals = async () => {
    try {
      const res = await apiGet("/trending-deals");
      if (res.detail?.code === 1) setTrendingDeals(res.detail.data || []);
    } catch {
      setErrors((e) => ({ ...e, trending: "Failed to fetch trending deals." }));
    }
  };

  const fetchRecentUpdates = async () => {
    try {
      const res = await apiGet("/recent-updates");
      if (res.detail?.code === 1) {
        const updates = res.detail.data.map((u) => ({
          ...u,
          image_url: proxyImage(u.image_url),
          price: `Rs ${Number(u.price).toLocaleString()}`,
          lastUpdated: new Date(u.last_updated),
        }));
        // Sort by latest update
        updates.sort((a, b) => b.lastUpdated - a.lastUpdated);
        setRecentUpdates(updates);
      }
    } catch {
      setErrors((e) => ({ ...e, updates: "Failed to fetch price updates." }));
    }
  };

  // ====== Effects ======
  useEffect(() => {
    fetchCategories();
    fetchTrendingDeals();
    fetchRecentUpdates();
    const interval = setInterval(nextSlide, 3000);
    return () => clearInterval(interval);
  }, []);

  // ====== Search Filters ======
  const filteredTrending = trendingDeals.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpdates = recentUpdates.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ====== Search Handler ======
  const handleSearch = (path) => {
    if (path === "/") navigate("/products");
  };

  return (
    <>
      <Header onSearch={handleSearch} />

      {/* ===== Welcome Modal ===== */}
      {showWelcome && (
        <div
          className="welcome-modal-overlay"
          onClick={(e) =>
            e.target.classList.contains("welcome-modal-overlay") &&
            setShowWelcome(false)
          }
        >
          <div className="welcome-modal">
            <button
              className="close-modal"
              onClick={() => setShowWelcome(false)}
            >
              ×
            </button>
            <img
              src={modalSlides[modalIndex].image}
              alt="feature"
              className="modal-image"
            />
            <h2>{modalSlides[modalIndex].title}</h2>
            <p>{modalSlides[modalIndex].text}</p>

            <div className="modal-controls">
              <button onClick={prevModal}>←</button>
              <div className="dots">
                {modalSlides.map((_, i) => (
                  <span
                    key={i}
                    className={i === modalIndex ? "dot active" : "dot"}
                    onClick={() => setModalIndex(i)}
                  />
                ))}
              </div>
              <button onClick={nextModal}>→</button>
            </div>

            <div className="welcome-actions">
              <Link to="/signup">
                <button>Register Now</button>
              </Link>
              <button onClick={() => setShowWelcome(false)}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main className="main-content">
        {/* Carousel */}
        <section className="featured-products">
          <div className="main-section">
            <div className="main-section-welcome">
              <h1>Welcome to BuySmart</h1>
              <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
              <button>Craete your account</button>
            </div>
            <div className="main-section-slider">
              <div className="carousel">
                <div className="carousel-item">
                  <img src={carouselImages[currentIndex].src} alt="Featured" />
                  <div className="carousel-caption">
                    {carouselImages[currentIndex].caption}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
          {/* <div className="carousel-controls">
            <button onClick={prevSlide}>&#10094;</button>
            <button onClick={nextSlide}>&#10095;</button>
          </div> */}
        </section>

        {/* Categories */}
        <section className="top-categories">
          <h2>Top Categories</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/category/${cat.id}`}
                key={cat.id}
                className="category-item-link"
              >
                <div className="category-item">
                  <img src={proxyImage(cat.image_url)} alt={cat.name} />
                  <p>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Deals */}
        <section className="trending-deals">
          <h2>Hot Deals</h2>
          <div className="deals-grid">
            {filteredTrending.map((deal) => {
              const oldPrice =
                parseFloat(deal.old_price?.replace("Rs ", "")) || 0;
              const newPrice =
                parseFloat(deal.current_price?.replace("Rs ", "")) || 0;
              const discount = oldPrice
                ? ((oldPrice - newPrice) / oldPrice) * 100
                : 0;

              return (
                <Link
                  to={`/product/${deal.id}`}
                  key={deal.id}
                  className="deal-item-link"
                >
                  <div className="deal-item">
                    <img src={proxyImage(deal.image_url)} alt={deal.name} />
                    <p>{deal.name?.slice(0, 50)}</p>
                    <span className="new-price">{deal.current_price}</span>
                    <span className="old-price">{deal.old_price}</span>
                    <span className="discount-badge">
                      {discount.toFixed(0)}% OFF
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Recent Updates */}
        <section className="recent-price-updates">
          <h2>Recent Price Updates</h2>
          <div className="updates-grid">
            {filteredUpdates.map((u) => (
              <Link
                to={`/product/${u.id}`}
                key={u.id}
                className="update-item-link"
              >
                <div className="update-item">
                  <img src={u.image_url} alt={u.name} />
                  <p>{u.name?.slice(0, 50)}</p>
                  <span className="price">{u.price}</span>
                  <span className="timestamp">
                    Updated: {u.lastUpdated.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
