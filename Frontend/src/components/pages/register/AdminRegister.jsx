import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminRegister.css'
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa"
import { adminRegisterService } from '../../../services/admin.service'

function AdminRegister() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    goverment_id: '',
    id_number: '',
    gst_number: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Password Toggle States
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const idValidations = {
    "Aadhaar": /^\d{12}$/,
    "Voter ID": /^[A-Z]{3}\d{7}$/,
    "PAN Card": /^[A-Z]{5}\d{4}[A-Z]$/,
    "Passport": /^[A-PR-WYa-pr-wy][1-9]\d{6}$/,
    "Driving License": /^[A-Z]{2}\d{13}$/,
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      setError("Enter a valid 10-digit mobile number starting with 6–9.")
      return
    }

    if (formData.goverment_id) {
      const pattern = idValidations[formData.goverment_id]
      if (!pattern.test(formData.id_number.toUpperCase())) {
        setError(`Invalid ${formData.goverment_id} number format.`)
        return
      }
    }

    const adminData = {
      name: formData.name,
      email: formData.email,
      mobile_number: formData.mobile_number,
      goverment_id: formData.goverment_id,
      id_number: formData.id_number,
      gst_number: formData.gst_number,
      password: formData.password,
    }

    setLoading(true)

    const response = await adminRegisterService(adminData)

    setLoading(false)

    if (!response.success) {
      setError(response.message)
      return
    }

    alert(response.message)
    navigate('/admin/login')
  }

  return (
    <div className="register-wrapper">

      <div className="register-left">
        <img src="/login.png" alt="Register Illustration" />
      </div>

      <div className="register-right">
        <div className="register-form">

          <h2><FaUser /> Admin Registration</h2>

          <form onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <div className="field-box">

            
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
                placeholder="Email"
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

              <select
                name="goverment_id"
                value={formData.goverment_id}
                onChange={handleChange}
                required
              >
                <option value="">Select Government ID</option>
                <option value="Aadhaar">Aadhaar</option>
                <option value="Voter ID">Voter ID</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
              </select>

              <input
                type="text"
                name="id_number"
                placeholder={`${formData.goverment_id || ""} Govt ID Number`}
                value={formData.id_number}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="gst_number"
                placeholder="GST Number"
                value={formData.gst_number}
                onChange={handleChange}
                required
              />

           
              <div className="password-box">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <span
                  className="toggle-eye"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

           
              <div className="password-box">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />

                <span
                  className="toggle-eye"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="divider">or</div>

          <p className="login-text">
            Already have an account? <Link to="/admin/login">Login</Link>
          </p>

        </div>
      </div>

    </div>
  )
}

export default AdminRegister
