import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../../../context/ProductContext";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContext } from "../../../context/ToastContext";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const API_BASE_URL =
    import.meta.env.VITE_PRODUCT_URL || "http://192.168.29.249:8001";

  if (loading) return <h2 className="loading">Loading...</h2>;

  const product = products.find((p) => p.id === Number(id));

  if (!product) return <h2 className="not-found">Product Not Found 😕</h2>;

  const imagePaths = Array.isArray(product.image_path) ? product.image_path : [];
  const images =
    imagePaths.length > 0
      ? imagePaths.map((img) => `${API_BASE_URL}/${img.replace(/^\/+/, "")}`)
      : ["/placeholder.png"];

  // Add to cart → cart redirect
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      showToast("Please login to add items to cart");
      localStorage.setItem("pendingProduct", product.id);
      return navigate("/login");
    }

    addToCart(product.id, quantity);
    showToast(`🛒 ${quantity} item(s) added to cart!`);

    navigate("/cart");
  };

  //  Buy Now → add + redirect
  const handleBuyNow = () => {
    if (!isLoggedIn) {
      showToast("Please login to continue");
      return navigate("/login");
    }

    addToCart(product.id, quantity);
    navigate("/cart");
  };

  // Quantity increment/decrement
  const incrementQty = () => {
    if (quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="product-details-page">
      <div className="details-container">

        {/* LEFT - IMAGE GALLERY */}
        <div className="details-image-section">
          <div className="main-image-wrapper">
            <img
              className="main-image"
              src={images[selectedImage] || images[0]}
              alt={product.name}
            />
          </div>

          <div className="image-thumbnails">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i + 1}`}
                className={`thumbnail ${selectedImage === i ? "active" : ""}`}
                onClick={() => setSelectedImage(i)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT - PRODUCT INFO */}
        <div className="details-info">
          <div className="product-header">
            <h1>{product.name}</h1>

            <div className="category-badge">
              {product.category?.category || "Uncategorized"}
            </div>
          </div>

          <div className="price-section">
            <p className="current-price">₹{product.price}</p>
            {product.original_price && (
              <p className="original-price">₹{product.original_price}</p>
            )}
          </div>

          <div className="stock-info">
            {product.quantity > 0 ? (
              <span className="in-stock">
                ✓ In Stock ({product.quantity} available)
              </span>
            ) : (
              <span className="out-of-stock">✗ Out of Stock</span>
            )}
          </div>

          <p className="product-description">{product.description}</p>

          {/* QUANTITY SELECTOR */}
          <div className="quantity-section">
            <label>Quantity:</label>
            <div className="quantity-controls">
              <button onClick={decrementQty} disabled={quantity <= 1}>
                −
              </button>
              <input type="number" value={quantity} readOnly />
              <button
                onClick={incrementQty}
                disabled={quantity >= product.quantity}
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="action-buttons">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
            >
              🛒 Add to Cart
            </button>
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={product.quantity === 0}
            >
              Buy Now
            </button>
          </div>

          {/* PRODUCT SPECS */}
          {product.specifications && (
            <div className="product-specs">
              <h3>Specifications</h3>
              <ul>
                {Object.entries(product.specifications).map(
                  ([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {value}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
