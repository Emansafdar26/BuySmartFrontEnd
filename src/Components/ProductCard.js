import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { apiGet, apiPost } from "../lib/apiwrapper";
import "../Styles/ProductCard.css";
import { createPortal } from "react-dom";

const ProductCard = ({ product }) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const navigate = useNavigate();

  // ✅ Auto-add product after login if pending
  useEffect(() => {
    const pendingFavoriteId = localStorage.getItem("pendingFavoriteProduct");
    const redirectUrl = localStorage.getItem("redirectAfterLogin");
    const token = localStorage.getItem("accessToken");

    if (token && pendingFavoriteId && Number(pendingFavoriteId) === product.id) {
      handleFavouriteToggle(); // Automatically add product to wishlist
      localStorage.removeItem("pendingFavoriteProduct");
    }

    if (token && redirectUrl) {
      localStorage.removeItem("redirectAfterLogin");
    }
  }, [product]);

  // ✅ Check if product is already in wishlist
  useEffect(() => {
    if (!product || !product.id) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    apiGet(`/products/${product.id}/isfavorite`)
      .then((res) => {
        if (res.resp && res.resp.code === 1) {
          setIsFavourite(res.resp.is_favorite);
        }
      })
      .catch(() => {});
  }, [product]);

  const handleFavouriteToggle = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      // Store pending product and redirect back after login
      localStorage.setItem("pendingFavoriteProduct", product.id);
      localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await apiPost("/products/togglefavorite", { product_id: product.id });

      if (res.resp && res.resp.code === 1) {
        const status = res.resp.status;

        if (status === "added") {
          setIsFavourite(true);
          setModalContent("Added to wishlist!");
        } else if (status === "removed") {
          setIsFavourite(false);
          setModalContent("Removed from wishlist!");
        } else if (status === "already") {
          setIsFavourite(true);
          setModalContent("Product already in wishlist!");
        } else {
          setModalContent("Something went wrong!");
        }

        setShowModal(true);
      } else {
        setModalContent(res.resp?.error || "Something went wrong!");
        setShowModal(true);
      }
    } catch (error) {
      setModalContent("Failed to update favorites!");
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  const hasDiscount = product.discount !== null && product.discount > 0;

  // ✅ Modal rendered via portal
  const Modal = () =>
    createPortal(
      <div className="custom-modal">
        <div className="custom-modal-content">
          <p>{modalContent}</p>
          <button onClick={() => setShowModal(false)} className="modal-close-btn">
            Close
          </button>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {showModal && <Modal />}

      <div className="product-card">
        <span
          className="favourite-icon"
          onClick={handleFavouriteToggle}
          style={{ cursor: loading ? "not-allowed" : "pointer" }}
        >
          {isFavourite ? <BsHeartFill color="red" size={22} /> : <BsHeart size={22} />}
        </span>

        <img
          src={`http://localhost:8000/image-proxy?url=${encodeURIComponent(product.image_url)}`}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://dummyimage.com/600x400/000/fff";
          }}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />

        {hasDiscount && <div className="discount-badge">{Math.round(product.discount)}% OFF</div>}

        <div className="products-info">
          <h3 className="products-name">{product.name?.slice(0, 40)}</h3>
          <p className="products-price">
            {hasDiscount ? (
              <>
                <span className="old-price">Rs {Number(product.old_price).toLocaleString()}</span>
                <span className="new-price">Rs {Number(product.price).toLocaleString()}</span>
              </>
            ) : product.price ? (
              `Rs ${Number(product.price).toLocaleString()}`
            ) : (
              "Price Not Available"
            )}
          </p>
          <Link to={`/product/${product.id}`} className="compare-button">
            Compare Prices
          </Link>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
