import React, { useContext, useState, useEffect } from "react";
import { authAPI } from "../../../api/instances";
import { AdminContext } from "../../../context/AdminContext";
import "./AdminProfile.css";

export default function AdminProfile() {
  const { admin, setAdmin } = useContext(AdminContext);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    Email: "",
    Mobile_Number: "",
    Goverment_ID: "",
    GST_Number: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    authAPI
      .get(`/api/admin_profile?token=${token}`)
      .then((res) => {
        const data = res.data;

        setAdmin(data);

        setFormData({
          name: data.name || "",
          Email: data.Email || "",
          Mobile_Number: data.Mobile_Number || "",
          Goverment_ID: data.Goverment_ID || "",
          GST_Number: data.GST_Number || "",
        });
      })
      .catch((err) => console.log("Profile fetch error:", err))
      .finally(() => setLoading(false));
  }, [setAdmin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Save Profile
  const handleSave = (e) => {
    e.preventDefault();

    // Update in Context
    setAdmin(formData);

    console.log("Updated profile:", formData);

    setEditMode(false);
  };

  if (loading) return <h2 className="loading">Loading profile...</h2>;

  return (
    <div className="profile-wrapper">

      <div className="profile-box">

        <h2 className="title">👤 {formData.name} Profile</h2>

        <form onSubmit={handleSave}>
          <div className="profile-fields">

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              readOnly={!editMode}
            />

            <input
              type="email"
              name="Email"
              placeholder="Email"
              value={formData.Email}
              onChange={handleChange}
              readOnly={!editMode}
            />

            <input
              type="text"
              name="Mobile_Number"
              placeholder="Mobile Number"
              value={formData.Mobile_Number}
              onChange={handleChange}
              readOnly={!editMode}
            />

            <input
              type="text"
              name="Goverment_ID"
              placeholder="Government ID"
              value={formData.Goverment_ID}
              onChange={handleChange}
              readOnly={!editMode}
            />

            <input
              type="text"
              name="GST_Number"
              placeholder="GST Number"
              value={formData.GST_Number}
              onChange={handleChange}
              readOnly={!editMode}
            />

          </div>

          <div className="form-buttons">
            {editMode ? (
              <>
                <button type="submit" className="btn-save">Save</button>
                <button className="btn-cancel" type="button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn-edit" type="button" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
