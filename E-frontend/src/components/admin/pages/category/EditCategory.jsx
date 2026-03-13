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

  useEffect(() => {
    getCategoryService(id).then((data) => {
      setFormData({
        category: data.category,
        description: data.description,
      });
    });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await updateCategoryService(id, formData);

    navigate("/admin/categoryList");
  };

  return (
    <div className="add-category-container">
      <h2>Edit Category</h2>

      <form className="category-form" onSubmit={handleSubmit}>
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

        <button className="btn-submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditCategory;
