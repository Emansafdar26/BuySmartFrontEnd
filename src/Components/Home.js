import React, { useState, useEffect } from "react";
import { useSearch } from "../AdminPanel/context/SearchContext";
import Header from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Styles/Home.css";
import SmartTV3 from "../Assets/SmartTV3.jpg";
import Refrigrator from "../Assets/Refrigrator.jpeg";
import WashingMachine from "../Assets/WashingMachine.png";
import Kitchen from "../Assets/Kitchen.jpg";
import category_tv from "../Assets/category_tv.jpeg";
import category_fridge from "../Assets/category_fridge.jpeg";
import category_washing from "../Assets/category_washing.jpeg";
import category_oven from "../Assets/category_oven.jpeg";
import category_ac from "../Assets/category_ac.webp";
import { apiGet } from '../lib/apiwrapper';

const images = [
  { src: SmartTV3, caption: "Latest Smart TVs at the Best Prices" },
  { src: Refrigrator, caption: "Find the Best Deals on Refrigerators – Stay Cool & Save Money!" },
  { src: WashingMachine, caption: "Top Washing Machines at the Best Prices – Compare & Choose Smartly!" },
  { src: Kitchen, caption: "Compare Prices on Kitchen Essentials – From Microwaves to Blenders!" },
  { src: category_ac, caption: "Beat the Heat with the Best ACs – Compare Prices & Stay Cool!" },
];

const Home = () => {
  const { searchQuery } = useSearch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [trendingDeals, setTrendingDeals] = useState([]);
  const [recentPriceUpdates, setRecentPriceUpdates] = useState([]);
  const [sortedRecentUpdates, setSortedRecentUpdates] = useState([]);

  const filteredTrendingDeals = trendingDeals.filter((deal) =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentUpdates = sortedRecentUpdates.filter((update) =>
    update.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Fetch categories from the API
  const getCategories = () => {
    apiGet('/categories')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1) {
            if (res.detail.data) {
              setCategories(res.detail.data);
            }
          } else if (res.detail.code === 0) {
            let newErrors = {};
            newErrors.categories = res.detail.error;
            setErrors(newErrors);
          }
        } else {
          let newErrors = {};
          newErrors.categories = "Unexpected response format.";
          setErrors(newErrors);
        }
      })
      .catch((err) => {
        console.log("API error while fetching categories:", err);
        let newErrors = {};
        newErrors.categories = "Something went wrong while fetching categories.";
        setErrors(newErrors);
      });
  };

  // Fetch trending deals from the API
  const getTrendingDeals = () => {
    apiGet('/trending-deals')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1) {
            if (res.detail.data) {
              setTrendingDeals(res.detail.data);
            }
          } else if (res.detail.code === 0) {
            let newErrors = {};
            newErrors.trendingDeals = res.detail.error;
            setErrors(newErrors);
          }
        } else {
          let newErrors = {};
          newErrors.trendingDeals = "Unexpected response format.";
          setErrors(newErrors);
        }
      })
      .catch((err) => {
        console.log("API error while fetching trending deals:", err);
        let newErrors = {};
        newErrors.trendingDeals = "Something went wrong while fetching trending deals.";
        setErrors(newErrors);
      });
  };

  // Sort recent price updates
  const sortRecentPriceUpdates = (updates) => {
    const sortedUpdates = [...updates].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    setSortedRecentUpdates(sortedUpdates);
  };

  // Fetch recent price updates from the API
  const getRecentPriceUpdates = () => {
    apiGet('/recent-updates')
      .then((res) => {
        if (res.detail) {
          if (res.detail.code === 1) {
            const formattedUpdates = res.detail.data.map(update => ({
              id: update.id,
              name: update.name,
              image_url: update.image_url,
              price: `Rs ${Number(update.price).toLocaleString()}`,
              lastUpdated: update.last_updated
            }));
            setRecentPriceUpdates(formattedUpdates);
          }
        } else {
          let newErrors = {};
          newErrors.recentPriceUpdates = "Unexpected response format.";
          setErrors(newErrors);
        }
      })
      .catch((err) => {
        console.log("API error while fetching recent price updates:", err);
        let newErrors = {};
        newErrors.recentPriceUpdates = "Something went wrong while fetching recent price updates.";
        setErrors(newErrors);
      });
  };

  // On component mount, fetch categories, trending deals, and recent price updates
  useEffect(() => {
    getCategories();
    getTrendingDeals();
    getRecentPriceUpdates();
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Sort the updates whenever the recent price updates change
  useEffect(() => {
    if (recentPriceUpdates.length > 0) {
      sortRecentPriceUpdates(recentPriceUpdates);
    }
  }, [recentPriceUpdates]);

  return (
    <>
      <Header />
      <Navbar />
      <main className="main-content">
        <section className="featured-products">
          <div className="carousel">
            <div className="carousel-item">
              <img src={images[currentIndex].src} alt="Featured Product" />
              <div className="carousel-caption">{images[currentIndex].caption}</div>
            </div>
          </div>
          <div className="carousel-controls">
            <button onClick={prevSlide}>&#10094;</button>
            <button onClick={nextSlide}>&#10095;</button>
          </div>
        </section>

        <section className="top-categories">
          <h2>Top Categories</h2>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <div className="category-item" key={index}>
                <img src={cat.image_url} alt="Category 4" />
                <p>{cat.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="trending-deals">
          <h2>Trending Deals</h2>
          <div className="deals-grid">
            {filteredTrendingDeals.map((deal, index) => {
              const oldPrice = parseFloat(deal.old_price.replace("Rs ", ""));
              const price = parseFloat(deal.current_price.replace("Rs ", ""));
              const discount = ((oldPrice - price) / oldPrice) * 100;

              return (
                <div key={index} className="deal-item">
                  <img src={deal.image_url} alt={deal.name} />
                  <p>{deal.name}</p>
                  <span className="new-price">Rs {Number(deal.current_price.replace("Rs ", "")).toLocaleString()}</span>
                  <span className="old-price">Rs {Number(deal.old_price.replace("Rs ", "")).toLocaleString()}</span>
                  <span className="discount-badge">
                    {discount.toFixed(0)}% OFF
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="recent-price-updates">
          <h2>Recent Price Updates</h2>
          <div className="updates-grid">
            {filteredRecentUpdates.map((update, index) => (
              <div key={index} className="update-item">
                <img src={update.image_url} alt={update.name} />
                <p>{update.name}</p>
                <span className="price">{update.price}</span>
                <span className="timestamp">Updated: {new Date(update.lastUpdated).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Home;
