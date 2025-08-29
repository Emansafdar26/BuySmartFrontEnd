import React, { useState } from "react";
import MainHeader from "./MainHeader";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../Styles/Contact.css";
import { BsEnvelope, BsPerson } from "react-icons/bs";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Show modal on submit
    setShowModal(true);
    // Clear form
    setFormData({ name: "", email: "", message: "" });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <MainHeader />
      <Navbar />

      <div className="contact-container">
        <section className="contact-hero">
          <h1>Contact Us</h1>
          <p>
            We are a student team working on BuySmart, our Final Year Project. 
            Have a question, suggestion, or just want to say hi? Send us a message below!
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-form">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              />
              <button type="submit">Send</button>
            </form>
          </div>

          <div className="contact-info">
            <h2>Our Team</h2>
            <p><BsPerson className="icon" /> Samra Safdar </p>
            <p><BsPerson className="icon" /> Eman Safdar </p>
            <p><BsPerson className="icon" /> Muneeba Fiaz </p>
            <p><BsEnvelope className="icon" />buysmart@gmail.com</p>
          </div>
        </section>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We'll get back to you soon.</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Contact;
