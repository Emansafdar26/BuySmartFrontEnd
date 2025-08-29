import React from "react";

import ac1 from "../Assets/ac1.jpg";
import Kitchen from "../Assets/Kitchen.png";
import sc from "../Assets/sc.jpg";
import category_oven from "../Assets/category_oven.jpeg";
import refrigrator from "../Assets/refrigrator.jpeg";
import iron from "../Assets/iron.png";

const Carousel = () => {
  return (
    <div className="carousel-section">
      <div className="top-carousel">
        <div className="carousel-image-container">
          <img src={ac1} alt="AC" className="carousel-image" />
        </div>
        <div className="carousel-image-container">
          <img src={Kitchen} alt="Kitchen" className="carousel-image" />
        </div>
        <div className="carousel-image-container">
          <img src={sc} alt="Smart Console" className="carousel-image" />
        </div>
        <div className="carousel-image-container">
          <img src={category_oven} alt="Oven" className="carousel-image" />
        </div>
        <div className="carousel-image-container">
          <img src={refrigrator} alt="Refrigerator" className="carousel-image" />
        </div>
        <div className="carousel-image-container">
          <img src={iron} alt="Iron" className="carousel-image" />
        </div>
      </div>

      <div className="marquee-strip">
        <span>
          Big Discounts on Electronics! | Shop Smart with BuySmart! | Track Prices in Real-Time!
        </span>
      </div>
    </div>
  );
};

export default Carousel;
