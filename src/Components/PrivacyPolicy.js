import React from "react";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Styles/PrivacyPolicy.css";
import { BsShieldLock, BsInfoCircle, BsBell, BsEnvelope } from "react-icons/bs";

const PrivacyPolicy = () => {
  return (
    <>
      <MainHeader />
      <Navbar />

      <div className="privacy-container">
        <section className="privacy-hero">
          <h1>Privacy Policy</h1>
          <p>
            At BuySmart, we value your trust. This policy explains how we collect, use, and protect your personal information while you enjoy smart shopping.
          </p>
        </section>

        <section className="privacy-section">
          <h2><BsShieldLock className="icon" /> Information We Collect</h2>
          <p>
            When you register, save products to your wishlist, or set target prices, we collect your name, email, and preferences. This helps us send notifications and improve your shopping experience.
          </p>
        </section>

        <section className="privacy-section">
          <h2><BsInfoCircle className="icon" /> How We Use Your Data</h2>
          <p>
            Your information is used to provide real-time price comparisons, notify you about price drops, and personalize your shopping experience. We never sell your personal information to third parties.
          </p>
        </section>

        <section className="privacy-section">
          <h2><BsBell className="icon" /> Notifications & Alerts</h2>
          <p>
            By adding products to your wishlist or setting target prices, you agree to receive email notifications when prices drop or change.
          </p>
        </section>

        <section className="privacy-section">
          <h2><BsEnvelope className="icon" /> Contact Us</h2>
          <p>
            If you have any questions regarding this policy or your personal data, please contact us at <strong>support@buysmart.com</strong>.
          </p>
        </section>

        <section className="privacy-footer-note">
          <p>
            By using BuySmart, you agree to this Privacy Policy. We may update this policy occasionally; the latest version will always be available here.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicy;
