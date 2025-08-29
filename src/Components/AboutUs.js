import React from "react";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Styles/AboutUs.css";
import { BsSearch, BsBarChart, BsHeart, BsBell, BsPersonCircle } from "react-icons/bs";

const AboutUs = () => {
  return (
    <>
      <MainHeader />
      <Navbar />

      <div className="about-container">
        <section className="about-hero">
          <h1>About BuySmart</h1>
          <p>
          BuySmart is a real-time price tracking and comparison web app designed to help you find the best deals across multiple 
          e-commerce platforms. It’s built as our Final Year Project, combining technology and convenience to make online shopping 
          smarter.
          </p>
        </section>

        <section className="mission-section">
          <h2>Our Mission</h2>
          <p>
          To make online shopping easier, faster, and budget-friendly by providing accurate, real-time price comparisons and alerts for 
          products you love.
          </p>
        </section>

        <section className="how-it-works">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step-card">
              <BsSearch size={40} className="step-icon" />
              <h3>Search</h3>
              <p>Quickly find the product you need.</p>
            </div>
            <div className="step-card">
              <BsBarChart size={40} className="step-icon" />
              <h3>Compare</h3>
              <p>See prices from multiple platforms in real-time.</p>
            </div>
            <div className="step-card">
              <BsHeart size={40} className="step-icon" />
              <h3>Wishlist</h3>
              <p>Save products and set target prices.</p>
            </div>
            <div className="step-card">
              <BsBell size={40} className="step-icon" />
              <h3>Notifications</h3>
              <p>Get alerts when prices drop or change.</p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="features-card">Real-time price updates</div>
            <div className="features-card">Multi-platform comparison</div>
            <div className="features-card">Wishlist & target prices</div>
            <div className="features-card">Price drop notifications</div>
            <div className="features-card"> Clean & easy-to-use interface</div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet the Team</h2>
          <div className="team-members">
            <div className="member-card">
              <BsPersonCircle size={80} className="member-icon" />
              <h3>Eman Safdar</h3>
            </div>
            <div className="member-card">
              <BsPersonCircle size={80} className="member-icon" />
              <h3>Muneeba Fiaz</h3>
            </div>
            <div className="member-card">
              <BsPersonCircle size={80} className="member-icon" />
              <h3>Samra Safdar</h3>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default AboutUs;
