import React from "react";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Styles/TermsAndConditions.css";
import { BsFileText, BsCheckCircle, BsPeople } from "react-icons/bs";

const TermsAndConditions = () => {
  return (
    <>
      <MainHeader />
      <Navbar />

      <div className="terms-container">
        <section className="terms-hero">
          <h1>Terms & Conditions</h1>
          <p>
            Welcome to BuySmart! By using our platform, you agree to follow these terms and conditions. Please read them carefully to ensure a safe and smooth shopping experience.
          </p>
        </section>

        <section className="terms-section">
          <h2><BsFileText className="icon" /> Using BuySmart</h2>
          <p>
            BuySmart is designed to provide real-time price comparisons and notifications. You agree to use the platform responsibly, without violating any laws or attempting to harm the service.
          </p>
        </section>

        <section className="terms-section">
          <h2><BsCheckCircle className="icon" /> Account & Wishlist</h2>
          <p>
            When you create an account, you are responsible for keeping your login details secure. Your wishlist and target prices help us provide personalized notifications and deals.
          </p>
        </section>

        <section className="terms-section">
          <h2><BsPeople className="icon" /> Third-Party Platforms</h2>
          <p>
            BuySmart aggregates prices from multiple e-commerce sites. We are not responsible for the accuracy of third-party prices or stock availability. Always verify details before making a purchase.
          </p>
        </section>

        <section className="terms-footer-note">
          <p>
            By using BuySmart, you agree to these terms. We may update them occasionally; the latest version will always be available on this page.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default TermsAndConditions;
