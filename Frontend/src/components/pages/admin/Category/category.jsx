import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosConfig";
import "./Register.css";
import { FaUser, FaLock } from "react-icons/fa"; 


function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      description: formData.description,
    };

    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/register", userData);

    
      console.log(res.data)
      setSuccess(res.data.message || "Registration successful!");
      setError("");

     
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
        console.log(err.response?.data.detail)
      setError(err.response?.data?.detail || "Registration failed!");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="signup-container">
        <div className="signup-box">
            <h2><FaUser />Category</h2>
        
          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile_number"
              placeholder="Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button type="submit" className="create-btn" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
