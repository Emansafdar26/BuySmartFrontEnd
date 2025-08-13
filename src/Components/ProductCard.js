import React from "react";
import { Link } from "react-router-dom";
import "../Styles/ProductCard.css";

const ProductCard = ({ product }) => {
  if (!product) return null;

  return (
    <div className="product-card">
      <img
  src={product.image_url}  
  alt={product.name}
  className="product-image"
  onError={(e)=> {
    e.target.onerror = null
    e.target.src='https://dummyimage.com/600x400/000/fff'
  }}
  /*style={{ width: "100px", height: "100px", objectFit: "cover" }}*/
/>


      <div className="products-info">
        <h3 className="products-name">{product.name?.slice(0,40)}</h3>

        <p className="products-price">
          {product.price ? `Rs ${Number(product.price).toLocaleString()}` : "Price Not Available"}
       </p>

        <Link to={`/product/${product.
          id}`} className="compare-button" aria-label={`Compare prices for ${product.name}`}>
          Compare Prices
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
