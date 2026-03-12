import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryList.css";
import { Link } from "react-router-dom";

function CategoryList() {
  const [categories, setCategories] = useState([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadData = async () => {
    const res = await axios.get("http://192.168.29.249:8001/categories/api/get_categories");
    setCategories(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;

    await axios.delete(`http://192.168.29.249:8001/categories/api/delete_category/${id}`);
    loadData();
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
