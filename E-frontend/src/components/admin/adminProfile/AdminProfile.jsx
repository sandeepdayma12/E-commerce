import React, { useContext, useState, useEffect } from "react";
import { adminAPI } from "../../../api/instances";
import { AdminContext } from "../../../context/AdminContext";
import "./AdminProfile.css";

export default function AdminProfile() {
  const { admin, setAdmin } = useContext(AdminContext);

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const [formData, setFormData] = useState({
    name: "",
    Email: "",
    Mobile_Number: "",
    Goverment_ID: "",
    GST_Number: "",
  });
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    adminAPI
      .get("/api/admin_profile")
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
        setInitialData({
          name: data.name || "",
          Email: data.Email || "",
          Mobile_Number: data.Mobile_Number || "",
          Goverment_ID: data.Goverment_ID || "",
          GST_Number: data.GST_Number || "",
        });
      })
      .catch((err) => {
        console.log("Profile fetch error:", err);
        setStatus({ type: "error", message: "Failed to load profile." });
      })
      .finally(() => setLoading(false));
  }, [setAdmin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateProfile = () => {
    if (!formData.name.trim()) return "Name is required.";
    if (!formData.Email.trim()) return "Email is required.";
    if (formData.Mobile_Number && !/^\d{7,15}$/.test(formData.Mobile_Number)) {
      return "Mobile number must be 7-15 digits.";
    }
    return null;
  };

  const handleCancel = () => {
    if (initialData) {
      setFormData(initialData);
    }
    setEditMode(false);
    setStatus({ type: "", message: "" });
  };

  // Save Profile
  const handleSave = async (e) => {
    e.preventDefault();

    const validationError = validateProfile();
    if (validationError) {
      setStatus({ type: "error", message: validationError });
      return;
    }

    const adminId = admin?.id ?? admin?.admin_id ?? admin?._id;
    if (!adminId) {
      setStatus({ type: "error", message: "Missing admin ID. Cannot update profile." });
      return;
    }

    try {
      setSaving(true);
      setStatus({ type: "", message: "" });

      await adminAPI.put(`/admin/update/${adminId}`, formData);
      setAdmin({ ...admin, ...formData });
      setInitialData({ ...formData });

      setStatus({ type: "success", message: "Profile updated successfully." });
      setEditMode(false);
    } catch (err) {
      console.log("Profile update error:", err);
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <h2 className="loading">Loading profile...</h2>;

  return (
    <div className="profile-wrapper">

      <div className="profile-box">

        <h2 className="title">{formData.name || "Admin"} Profile</h2>

        {status.message && (
          <p className={status.type === "error" ? "error-text" : "success-text"}>
            {status.message}
          </p>
        )}

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
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="btn-cancel" type="button" onClick={handleCancel}>
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
