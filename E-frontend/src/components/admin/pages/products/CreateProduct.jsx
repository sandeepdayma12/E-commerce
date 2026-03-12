import React, { useState, useEffect,useContext } from "react";
import "./CreateProduct.css";
import { useNavigate } from "react-router-dom";

import { getCategoriesService } from "../../../../services/categories.service";
import { createProductService } from "../../../../services/product.service";
import { AdminContext } from "../../../../context/AdminContext";


function CreateProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const { isAdminLoggedIn } = useContext(AdminContext);

  const [message, setMessage] = useState(null);     // SUCCESS / ERROR message
  const [msgType, setMsgType] = useState("success"); // success / error

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category_id: "",
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategoriesService();
        setCategories(data || []);
      } catch (err) {
        showMessage("Failed to load categories!", "error");
      }
    };

    loadCategories();
  }, []);

  // Show message on screen (no alert)
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMsgType(type);

    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  // Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Image Upload Preview
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate("/admin/login");
    }
  }, [isAdminLoggedIn]);
  // Cleanup image preview
  useEffect(() => {
    return () => {
      imagePreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreview]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      form.append(key, value)
    );

    images.forEach((img) => form.append("images", img));

    try {
      await createProductService(form);
      showMessage("Product created successfully!", "success");

      setTimeout(() => {
        navigate("/admin/productList");
      }, 1000);
    } catch (err) {
      showMessage("Failed to create product!", "error");
    }
  };

  return (
    <div className="add-product-page">
      <div className="add-product-container">

        {/* ✔ Message Box */}
        {message && (
          <div className={`msg-box ${msgType}`}>
            {message}
          </div>
        )}

        <div className="page-header">
          <h2>Add New Product</h2>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>

          {/* NAME */}
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter Product Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* CATEGORY */}
          <div className="form-group">
            <label>Select Category</label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>

              {categories.length > 0 ? (
                categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.category}
                  </option>
                ))
              ) : (
                <option disabled>No Categories Found</option>
              )}
            </select>
          </div>

          {/* QUANTITY */}
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              placeholder="Enter Quantity"
              onChange={handleChange}
              required
            />
          </div>

          {/* PRICE */}
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Enter Price"
              onChange={handleChange}
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              placeholder="Enter Description"
              onChange={handleChange}
              required
            />
          </div>

          {/* IMAGE UPLOAD */}
          <div className="form-group">
            <label>Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
          </div>

          {/* PREVIEW */}
          {imagePreview.length > 0 && (
            <div className="preview-container">
              {imagePreview.map((img, idx) => (
                <img key={idx} src={img} className="product-preview" alt="Preview" />
              ))}
            </div>
          )}

          <button type="submit" className="btn-submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default CreateProduct;
