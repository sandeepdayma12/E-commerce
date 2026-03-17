import React, { useEffect, useState } from "react";
import "./CategoryList.css";
import { Link } from "react-router-dom";
import {
  getCategoriesService,
  deleteCategoryService,
} from "../../../../services/categories.service";

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    try {
      const data = await getCategoriesService();
      setCategories(data || []);
    } catch (err) {
      console.log("Category list error:", err);
      setStatus({ type: "error", message: "Failed to load categories." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;

    try {
      await deleteCategoryService(id);
      setStatus({ type: "success", message: "Category deleted successfully." });
      loadData();
    } catch (err) {
      console.log("Delete category error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to delete category.",
      });
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="category-list-container">

      {/* HEADER */}
      <div className="list-header">
        <h2><span className="icon-box">📂</span> All Categories</h2>

        <Link to="/admin/createcategory" className="add-btn">+ Add New</Link>
      </div>

      {status.message && (
        <p className={status.type === "error" ? "error-text" : "success-text"}>
          {status.message}
        </p>
      )}

      {/* TABLE */}
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentCategories.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.category}</td>
              <td>{c.description}</td>

              <td>
                <Link to={`/admin/editCategory/${c.id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>

                <button className="delete-btn" onClick={() => handleDelete(c.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!loading && categories.length === 0 && (
        <p className="empty-text">No categories found.</p>
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={currentPage === 1}
          onClick={() => changePage(currentPage - 1)}
        >
          ❮ Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => changePage(i + 1)}
            className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="page-btn"
          disabled={currentPage === totalPages}
          onClick={() => changePage(currentPage + 1)}
        >
          Next ❯
        </button>
      </div>
    </div>
  );
}

export default CategoryList;
