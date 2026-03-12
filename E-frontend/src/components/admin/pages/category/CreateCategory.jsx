import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateCategory.css";

function CreateCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const validateFields = () => {
    if (!formData.category.trim()) return "Category name is required.";
    if (formData.category.length < 3) return "Category must be at least 3 characters.";
    if (!formData.description.trim()) return "Description is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateFields();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://192.168.29.249:8001/categories/api/create_category",
        formData
      );

      navigate("/admin/categoryList");  
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add category!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-category-container">
      <h2>Add New Category</h2>

      <form className="category-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}
        
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn-submit" disabled={loading}>
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}

export default CreateCategory;
