import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditCategory.css";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  useEffect(() => {
    axios
      .get(`http://192.168.29.249:8001/categories/api/get_category/${id}`)
      .then((res) => {
        setFormData({
          category: res.data.category,
          description: res.data.description,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      `http://192.168.29.249:8001/categories/api/update_category/${id}`,
      formData
    );

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
