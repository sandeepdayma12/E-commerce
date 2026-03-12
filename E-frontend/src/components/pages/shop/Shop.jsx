import React, { useState, useContext, useEffect, useMemo } from "react";
import "./Shop.css";

import { AuthContext } from "../../../context/AuthContext";
import { ProductContext } from "../../../context/ProductContext";
import { CartContext } from "../../../context/CartContext";
import { ToastContext } from "../../../context/ToastContext";

import { useNavigate, Link, useLocation } from "react-router-dom";

function Shop() {
  /*CONTEXTS*/
  const { isLoggedIn } = useContext(AuthContext);
  const { products, loading } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);

  /*ROUTER*/
  const navigate = useNavigate();
  const location = useLocation();

  /*URL PARAMS*/
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  const searchQuery = params.get("search") || "";
  const categoryQuery = params.get("category") || "All";

  /*STATES*/
  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);
  const [priceRange, setPriceRange] = useState(100000);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;


  // Sync category with URL
  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery]);

  /*DATA TRANSFORMATION*/
  const API_BASE_URL =
    import.meta.env.VITE_PRODUCT_URL || "http://192.168.29.249:8001";

  const transformedProducts = useMemo(() => {
    return products.map((p) => ({
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
  }, [products]);

  /*CATEGORY LIST*/
  const categories = useMemo(() => {
    return ["All", ...new Set(transformedProducts.map((p) => p.category))];
  }, [transformedProducts]);

  /*FILTERED PRODUCTS*/
  const filteredProducts = useMemo(() => {
    const searchTerm = searchQuery.toLowerCase();

    return transformedProducts.filter((p) => {
      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchPrice = p.price <= priceRange;

      const matchSearch =
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm) ||
        p.description?.toLowerCase().includes(searchTerm) ||
        p.category?.toLowerCase().includes(searchTerm);

      return matchCategory && matchPrice && matchSearch;
    });
  }, [selectedCategory, priceRange, searchQuery, transformedProducts]);

  /** ---------------- PAGINATION ---------------- **/
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  /** ---------------- CLICK HANDLERS ---------------- **/
  const handleAdd = (product) => {
    if (!isLoggedIn) {
      localStorage.setItem("pendingProduct", product.id);
      navigate("/login");
      return;
    }

    addToCart(product.id);
    showToast("🛒 Added to cart!");
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <h2 className="loading">Loading products...</h2>;

  return (
    <div className="shop-container">

      {/* LEFT FILTER SECTION */}
      <div className="shop-filters">
        <h2 className="filter-title">Filter Products</h2>

        <div className="filter-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              className={selectedCategory === cat ? "active-cat" : ""}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="price-filter">
          <label>
            Max Price: <strong>₹{priceRange}</strong>
          </label>
          <input
            type="range"
            min="100"
            max="1000000"
            step="500"
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="shop-main">
        <div className="shop-products">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div className="product-card" key={product.id}>

                <Link to={`/product/${product.id}`} className="img-wrapper">
                  <img src={product.img} alt={product.title} />
                </Link>

                <div className="product-info">
                  <h3>{product.title}</h3>

                  <p className="desc">
                    {product.description?.length > 40
                      ? product.description.substring(0, 40) + "..."
                      : product.description}
                  </p>

                  <p className="price">₹{product.price}</p>

                  <button onClick={() => handleAdd(product)}>
                    <i class="ri-shopping-cart-2-fill"></i> Add to Cart
                  </button>
                </div>

              </div>
            ))
          ) : (
            <p className="no-products">No products found</p>
          )}
        </div>

        {/* PAGINATION */}
        {filteredProducts.length > itemsPerPage && (
          <div className="pagination">
            <button
              className="page-btn prev"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>

            <div className="page-numbers">
              {pageNumbers.map((p, index) =>
                p === "..." ? (
                  <span key={index} className="ellipsis">...</span>
                ) : (
                  <button
                    key={p}
                    className={`page-num ${currentPage === p ? "active" : ""}`}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            <button
              className="page-btn next"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default Shop;
