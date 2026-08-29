import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCategory.css";
import {
  getCategoryService,
  updateCategoryService,
} from "../../../../services/categories.service";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    getCategoryService(id)
      .then((data) => {
        setFormData({
          category: data.category,
          description: data.description,
        });
      })
      .catch((err) => {
        console.log("Category fetch error:", err);
        setStatus({ type: "error", message: "Failed to load category." });
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setStatus({ type: "", message: "" });
      await updateCategoryService(id, formData);
      setStatus({ type: "success", message: "Category updated successfully." });
      setTimeout(() => navigate("/admin/categoryList"), 600);
    } catch (err) {
      console.log("Category update error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update category.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-category-container">
      <h2>Edit Category</h2>

      <form className="category-form" onSubmit={handleSubmit}>
        {status.message && (
          <p className={status.type === "error" ? "error-text" : "success-text"}>
            {status.message}
          </p>
        )}
        <div className="form-group">
          <label>Category Name</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <button className="btn-submit" disabled={saving || loading}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditCategory;
