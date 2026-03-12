import React, { useContext, useState, useEffect } from 'react';
import { authAPI } from '../../../api/instances';
import { AuthContext } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    authAPI
      .get(`/api/user_profile?token=${token}`)
      .then((res) => {
        const d = res.data;
        setUser(d);
        setFormData({
          name: d?.name || "",
          email: d?.email || d?.Email || "",
          mobile: d?.Mobile_Number || d?.Moblile_Number || "",
        });
      })
      .catch((err) => {
        console.log("Profile fetch error:", err);
        showMessage('error', 'Failed to load profile');
      })
      .finally(() => setLoading(false));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showMessage('error', 'Please fix the errors below');
      return;
    }

    setSaving(true);
    authAPI
      .put(`/api/update_profile?token=${token}`, {
        name: formData.name,
        Mobile_Number: formData.mobile,
      })
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
        showMessage('success', '✓ Profile updated successfully!');
      })
      .catch((err) => {
        console.log("Update error:", err);
        showMessage('error', 'Failed to update profile. Please try again.');
      })
      .finally(() => setSaving(false));
  };

  const handleCancel = () => {
    setEditMode(false);
    setErrors({});
    setFormData({
      name: user?.name || "",
      email: user?.email || user?.Email || "",
      mobile: user?.Mobile_Number || "",
    });
  };

  if (loading) return <div className="loading-page">Loading profile...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        {/* Message Notification */}
        {message.text && (
          <div className={`message-notification ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="profile-header">
          <h1>My Profile</h1>
          {!editMode && (
            <button className="edit-header-btn" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {/* Main Grid */}
        <div className="profile-grid">
          
          {/* Left Column - Profile Info */}
          <div className="left-section">
            
            {/* Profile Card */}
            <div className={`profile-card ${editMode ? 'editing' : ''}`}>
              <div className="avatar-section">
                <div className="avatar-circle">
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    alt="Avatar"
                  />
                  {editMode && (
                    <div className="avatar-overlay">
                      <span>📷</span>
                    </div>
                  )}
                </div>
                <h2>{formData.name || "User"}</h2>
                <p className="user-email">{formData.email}</p>
              </div>

              <form onSubmit={handleSave} className="profile-form">
                
                <div className="form-field">
                  <label>
                    Full Name {editMode && <span className="required">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    readOnly={!editMode}
                    onChange={handleChange}
                    className={`${editMode ? 'editable' : ''} ${errors.name ? 'error' : ''}`}
                    placeholder={editMode ? "Enter your full name" : ""}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    className="disabled"
                  />
                  <small className="field-hint">🔒 Email cannot be changed</small>
                </div>

                <div className="form-field">
                  <label>
                    Mobile Number {editMode && <span className="required">*</span>}
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    readOnly={!editMode}
                    onChange={handleChange}
                    className={`${editMode ? 'editable' : ''} ${errors.mobile ? 'error' : ''}`}
                    maxLength="10"
                    placeholder={editMode ? "10 digit mobile number" : ""}
                  />
                  {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                </div>

                <div className="form-field">
                  <label>Member Since</label>
                  <input
                    type="text"
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    }) : "N/A"}
                    readOnly
                    className="disabled"
                  />
                </div>

                {editMode && (
                  <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={saving}>
                      {saving ? "Saving..." : "💾 Save Changes"}
                    </button>
                    <button 
                      type="button"
                      className="btn-cancel"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Quick Links */}
          <div className="right-section">

            {/* Quick Links */}
            <div className="quick-links-card">
              <h3>Quick Actions</h3>
              <div className="links-list">
                <Link to="/orders" className="quick-link">
                  <span className="link-icon">📋</span>
                  <div className="link-content">
                    <p className="link-title">My Orders</p>
                    <p className="link-desc">View order history</p>
                  </div>
                  <span className="link-arrow">→</span>
                </Link>

                <Link to="/cart" className="quick-link">
                  <span className="link-icon">🛒</span>
                  <div className="link-content">
                    <p className="link-title">Shopping Cart</p>
                    <p className="link-desc">View cart items</p>
                  </div>
                  <span className="link-arrow">→</span>
                </Link>

                <Link to="/shop" className="quick-link">
                  <span className="link-icon">🛍️</span>
                  <div className="link-content">
                    <p className="link-title">Browse Products</p>
                    <p className="link-desc">Continue shopping</p>
                  </div>
                  <span className="link-arrow">→</span>
                </Link>
              </div>
            </div>

            {/* Account Info */}

          </div>
        </div>

      </div>
    </div>
  );
}
