import React, { useState, useEffect } from "react";
import { useSearch } from "../AdminPanel/context/SearchContext";
import { useNavigate, Link } from "react-router-dom";
import { BsGraphDown, BsBell, BsHeart, BsBarChart } from "react-icons/bs";
import Header from "./MainHeader";
import Footer from "./Footer";
import Carousel from "./Carousel";
import "../Styles/Home.css";
import { apiGet } from "../lib/apiwrapper";
import { isAuthenticated } from "../lib/auth"; 
import Background2 from "../Assets/Background2.png";

const proxyImage = (url) =>
  url ? `http://localhost:8000/image-proxy?url=${encodeURIComponent(url)}` : "";

const Home = () => {
  const { searchQuery } = useSearch();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [trendingDeals, setTrendingDeals] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [errors, setErrors] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

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
        updates.sort((a, b) => b.lastUpdated - a.lastUpdated);
        setRecentUpdates(updates);
      }
    } catch {
      setErrors((e) => ({ ...e, updates: "Failed to fetch price updates." }));
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTrendingDeals();
    fetchRecentUpdates();
    setLoggedIn(isAuthenticated()); 
  }, []);

  const filteredTrending = trendingDeals.filter((d) =>
    d.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpdates = recentUpdates.filter((u) =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (path) => {
    if (path === "/") navigate("/products");
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Carousel/>
      <main className="main-content">
        <section
          className="background-section"
          style={{ backgroundImage: `url(${Background2})` }}
        >
          <div className="background-content">
  {!loggedIn ? (
    <>
      <h2>Save More, Shop Smarter</h2>
      <p>
        With BuySmart, you never miss a deal. Create your account today and
        start tracking your favorite products!
      </p>
      <h4 className="tagline">Your personal price tracker at one place</h4>
     
      <div className="cta-buttons">
        <Link to="/SignUp" className="background-btn">
          Register Now
        </Link>
        <Link to="/products" className="background-btn secondary-btn">
          Explore Products
        </Link>
      </div>

    </>
  ) : (
    <>
      <h2>Welcome Back to BuySmart</h2>
      <p>
        Track your saved products and get real-time alerts!
      </p>

      <div className="cta-buttons">
        <Link to="/favourites" className="background-btn">
          Go to Wishlist
        </Link>
        <Link to="/products" className="background-btn secondary-btn">
          Explore Products
        </Link>
      </div>
    </>
  )}
</div>
</section>

  <section className="feature-section">
    <h2 className="feature-heading">Why Choose BuySmart?</h2>
    <div className="feature-grid">
      <div className="feature-card">
        <span className="feature-icon"><BsGraphDown /></span>
        <h3>Track Live Prices</h3>
       <p>See real-time price changes to always get the best deal.</p>
      </div>
      <div className="feature-card">
        <span className="feature-icon"><BsBell /></span>
        <h3>Instant Alerts</h3>
        <p>Get notified the moment prices drop on items you’re watching.</p>
      </div>
      <div className="feature-card">
        <span className="feature-icon"><BsHeart /></span>
        <h3>Wishlist</h3>
        <p>Save your favorite products and track them all in one place.</p>
      </div>
      <div className="feature-card">
        <span className="feature-icon"><BsBarChart /></span>
        <h3>Compare Before You Buy</h3>
        <p>Quickly compare prices across multiple platforms to find the best deal.</p>
      </div>
    </div>
  </section>
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

                    <span className="new-price">
                      Rs {newPrice.toLocaleString()}
                    </span>
                    <span className="old-price">
                      Rs {oldPrice.toLocaleString()}
                    </span>

                    <span className="discount-badge">
                      {discount.toFixed(0)}% OFF
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

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
