import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { adminLoginService } from "../../../services/admin.service";
import "./AdminLogin.css";
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AdminContext);

  const [formData, setFormData] = useState({
    Email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const response = await adminLoginService(formData);

    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    login(response.token);

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => navigate("/admin/dashboard"), 1200);
  };

  return (
    <div className="login-page">

      {/* Left Illustration */}
      <div className="login-left">
        <img src="/login-illustration.webp" alt="Login Illustration" />
      </div>

      {/* Right Login Form */}
      <div className="login-right">
        <div className="login-box">
          <h2><FaUser /> Login Account</h2>
          <p className="subtitle">Welcome back! Please enter your details.</p>

          <div className="form-data">
            <form onSubmit={handleSubmit}>
              
              {error && <p className="error-text">{error}</p>}
              {success && <p className="success-text">{success}</p>}

              {/* Email */}
              <div className="field">
                <input
                  type="email"
                  name="Email"
                  placeholder="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password */}
              <div className="field password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Login Button */}
              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="divider">or</div>

              <p className="register-text">
                Don’t have an account?{" "}
                <Link to="/admin/register">Register</Link>
              </p>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminLogin;
