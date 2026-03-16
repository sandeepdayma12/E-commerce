import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";
import { categoryAPI, productAPI } from "../../../../api/instances";
import { toProductImageUrl } from "../../../../utils/image";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    quantity: "",
    price: "",
    description: "",
    is_active: true,
  });

  // Load categories
  useEffect(() => {
    categoryAPI
      .get("/get_categories/")
      .then((res) => setCategories(res.data || []))
      .catch((err) => {
        console.log("Category fetch error:", err);
        setStatus({ type: "error", message: "Failed to load categories." });
      });
  }, []);

  // Load existing product data
  useEffect(() => {
    productAPI
      .get(`/api/product/get/${id}`)
      .then((res) => {
        const p = res.data;

        setFormData({
          name: p.name,
          category_id: p.category_id,
          quantity: p.quantity,
          price: p.price,
          description: p.description,
          is_active: p.is_active,
        });

        if (p.image_path && p.image_path.length > 0) {
          setImagePreview(toProductImageUrl(p.image_path[0]));
        }
      })
      .catch((err) => {
        console.log("Fetch error:", err);
        setStatus({ type: "error", message: "Failed to load product." });
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("description", formData.description);
    form.append("category_id", formData.category_id);
    form.append("is_active", formData.is_active);

    if (newImage) {
      form.append("images", newImage);
    }

    try {
      setSaving(true);
      setStatus({ type: "", message: "" });
      await productAPI.put(`/api/update_product/${id}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus({ type: "success", message: "Product updated successfully." });
      setTimeout(() => navigate("/admin/productList"), 600);

    } catch (err) {
      console.error("Update error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update product.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
  <div className="edit-product-page">
    <div className="add-product-container">

      <div className="page-header">
        <h2>
         Edit Product
        </h2>
      </div>

      <form className="product-form" onSubmit={handleSubmit}>
        {status.message && (
          <p className={status.type === "error" ? "error-text" : "success-text"}>
            {status.message}
          </p>
        )}
        
        <div className="form-group">
          <label>Product Name</label>
          <input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            required
            disabled={loading}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            disabled={loading}
          />
        </div>

        <div className="form-group description-box">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
            disabled={loading}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Product Image</label>

          {imagePreview && (
            <img src={imagePreview} alt="Product" className="product-preview" />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewImage(e.target.files[0])}
            disabled={loading}
          />
        </div>

        <button className="btn-submit" disabled={saving || loading}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

    </div>
  </div>
);

}

export default EditProduct;
