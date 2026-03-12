import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { ProductContext } from "../../../context/ProductContext";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContext } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { products, loading } = useContext(ProductContext);
  const { addToCart, cart } = useContext(CartContext);
  const { isLoggedIn } = useContext(AuthContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_PRODUCT_URL || "http://192.168.29.249:8001";

  const transformedProducts = products.map((p) => ({
    id: p.id,
    title: p.name,
    price: p.price,
    category: p.category?.category,
    img: p.image_path[0]
      ? `${API_BASE_URL}/${p.image_path[0].replace(/^\/+/, "")}`
      : "/placeholder.png",
    description: p.description,
    stock: p.quantity,
  }));

  useEffect(() => {
    if (loading) return;

    const cats = [...new Set(transformedProducts.map((p) => p.category))];
    setCategories(cats);
    setBestSelling(transformedProducts.slice(0, 5));

    const shuffled = [...transformedProducts].sort(() => 0.5 - Math.random());
    setFeaturedProducts(shuffled.slice(0, 4));
  }, [products, loading]);

  // Check if product is in cart
  const isInCart = (productId) => {
    return cart?.some(item => item.id === productId);
  };

  // Handle Add to Cart
  const handleAdd = (product) => {
    if (!isLoggedIn) {
      localStorage.setItem("pendingProduct", product.id);
      navigate("/login");
      return;
    }
    addToCart(product.id);
    showToast("🛒 Added to cart!");
  };

  // Handle Quick View
  const handleQuickView = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Amazing Products...</h2>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <ImageSlider />
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">New Collection 2025</span>
            <h1 className="hero-title">Discover the Latest Trends</h1>
            <p className="hero-description">
              Shop from a wide range of fashion, electronics, and more — all in one place.
            </p>
            <Link to="/shop" className="hero-btn">
              Shop Now
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Category Section */}
      <section className="category-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="side-title">Categories</span>
            <h2 className="section-title">Browse By Category</h2>
          </div>
          <div className="arrows">
            <button className="arrow-btn left">
              <img src="/Left-Arrow.png" alt="Previous" />
            </button>
            <button className="arrow-btn right">
              <img src="/Right-Arrow.png" alt="Next" />
            </button>
          </div>
        </div>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to={`/shop?category=${cat}`}
              className="category-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="category-icon">
                <span>{(cat || "").charAt(0).toUpperCase()}</span>
              </div>
              <h3 className="category-name">{cat || "Unknown"}</h3>
              <span className="category-arrow">→</span>
            </Link>
          ))}

        </div>
      </section>

      <div className="divider"></div>

      {/* Best Selling with Enhanced Features */}
      <section className="products-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="side-title">This Month</span>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <Link to="/shop" className="view-all-btn">
            View All Products
            <span className="btn-arrow">→</span>
          </Link>
        </div>

        <div className="products-grid">
          {bestSelling.map((item, index) => (
            <div
              key={item.id}
              className="product-card-enhanced"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="product-image-wrapper">
                <Link to={`/product/${item.id}`}>
                  <img src={item.img} alt={item.title} className="product-image" />
                </Link>

                {/* Quick View Button Only */}
                <div className="product-actions">
                  <button
                    className="action-btn quick-view-btn"
                    onClick={(e) => handleQuickView(item, e)}
                    title="Quick View"
                  >
                    <i className="ri-eye-fill"></i>
                  </button>
                </div>

                {/* Badges */}
                {item.stock < 10 && <span className="badge low-stock">Low Stock</span>}
                {isInCart(item.id) && <span className="badge in-cart">In Cart</span>}
              </div>

              <div className="product-info">
                <Link to={`/product/${item.id}`} className="product-title-link">
                  <h3 className="product-title">{item.title}</h3>
                </Link>
                <p className="product-price">₹{item.price.toLocaleString('en-IN')}</p>

                <button
                  className={`add-cart-btn ${isInCart(item.id) ? 'in-cart-btn' : ''}`}
                  onClick={() => handleAdd(item)}
                  disabled={isInCart(item.id)}
                >
                  {isInCart(item.id) ? (
                    <>
                      <span>✓ In Cart</span>
                    </>
                  ) : (
                    <>
                      <span>Add to Cart</span>
                      <span className="cart-icon"><i className="ri-shopping-cart-2-fill"></i></span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="promo-banner">
        <div className="promo-content">
          <img src="/radio.png" alt="Special Offer" className="promo-image" />
          <div className="promo-overlay">
            {/* <h2>Limited Time Offer</h2>
            <p>Don't miss out on exclusive deals</p> */}
            {/* <button className="promo-btn">Buy Now!</button> */}
          </div>
        </div>
      </section>

      <div className="divider"></div>

      {/* Dynamic Featured Section */}
      <section className="featured-section">
        <div className="section-header">
          <div className="section-title-wrapper">
            <span className="side-title">Featured</span>
            <h2 className="section-title">Featured Collections</h2>
          </div>
          <Link to="/shop" className="view-all-btn">
            View All
            <span className="btn-arrow">→</span>
          </Link>
        </div>

        <div className="featured-grid-compact">
          {featuredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={`featured-card ${index === 0 ? 'featured-large' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="featured-image-wrapper">
                <img src={product.img} alt={product.title} />
                <div className="featured-gradient"></div>
              </div>
              <div className="featured-content">
                <span className="featured-category">{product.category}</span>
                <h3 className="featured-title">{product.title}</h3>
                <p className="featured-price">₹{product.price.toLocaleString('en-IN')}</p>
                <button className="featured-btn">Shop Now →</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="trust-item">
          <div className="trust-icon">🚚</div>
          <h4>Free Delivery</h4>
          <p>On orders over ₹500</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">🔒</div>
          <h4>Secure Payment</h4>
          <p>100% secure transactions</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">↩️</div>
          <h4>Easy Returns</h4>
          <p>30-day return policy</p>
        </div>
        <div className="trust-item">
          <div className="trust-icon">💬</div>
          <h4>24/7 Support</h4>
          <p>Dedicated customer service</p>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeQuickView}>✕</button>

            <div className="quick-view-content">
              <div className="quick-view-image">
                <img src={quickViewProduct.img} alt={quickViewProduct.title} />
              </div>

              <div className="quick-view-details">
                <span className="quick-view-category">{quickViewProduct.category}</span>
                <h2>{quickViewProduct.title}</h2>
                <p className="quick-view-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</p>

                <p className="quick-view-description">
                  {quickViewProduct.description || "Premium quality product with excellent features."}
                </p>

                <div className="quick-view-stock">
                  {quickViewProduct.stock > 0 ? (
                    <span className="in-stock">✓ In Stock ({quickViewProduct.stock} available)</span>
                  ) : (
                    <span className="out-of-stock">✗ Out of Stock</span>
                  )}
                </div>

                <div className="quick-view-actions">
                  <button
                    className="quick-add-cart"
                    onClick={() => {
                      handleAdd(quickViewProduct);
                      closeQuickView();
                    }}
                    disabled={isInCart(quickViewProduct.id)}
                  >
                    {isInCart(quickViewProduct.id) ? '✓ In Cart' : '🛒 Add to Cart'}
                  </button>

                  <Link
                    to={`/product/${quickViewProduct.id}`}
                    className="view-full-details"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
