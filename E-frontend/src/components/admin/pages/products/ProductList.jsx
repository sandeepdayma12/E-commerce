import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductList.css";

import {
  getProductsByAdminService,
  deleteProductService,
} from "../../../../services/product.service";
import { toProductImageUrl } from "../../../../utils/image";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Load admin-specific products
  const loadProducts = async () => {
    try {
      const data = await getProductsByAdminService();
      setProducts(data || []);
    } catch (err) {
      console.log("Failed to load products:", err);
      setStatus({ type: "error", message: "Failed to load products." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProductService(id);
      setStatus({ type: "success", message: "Product deleted successfully." });
      loadProducts();
    } catch (err) {
      console.log("Delete Error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to delete product.",
      });
    }
  };

  // Pagination Calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="product-list-container">

      <div className="list-header">
        <h2>Your Products</h2>

        <Link to="/admin/createProduct" className="add-btn">+ Add New</Link>
      </div>

      {status.message && (
        <p className={status.type === "error" ? "error-text" : "success-text"}>
          {status.message}
        </p>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>

              <td>
                <img
                  src={
                    p.image_path?.[0]
                      ? toProductImageUrl(p.image_path[0])
                      : "/placeholder.png"
                  }
                  alt={p.name || "Product"}
                  className="product-img"
                />
              </td>

              <td>{p.name}</td>
              <td>{p.category?.category}</td>
              <td>{p.quantity}</td>
              <td>₹{p.price}</td>

              <td>
                <Link to={`/admin/editProduct/${p.id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && products.length === 0 && (
        <p className="empty-text">No products found.</p>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ❮ Prev
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`page-number ${
              currentPage === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next ❯
        </button>
      </div>

    </div>
  );
}

export default ProductList;
