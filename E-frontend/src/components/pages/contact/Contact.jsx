import React, { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Message Sent:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>
          Contact <span>Us</span>
        </h1>
        <p className="contact-subtitle">
          We'd love to hear from you! Fill out the form or reach us through the details below.
        </p>

        <div className="contact-content">
          {/* Contact Form */}
          <div className="contact-form">
            {submitted ? (
              <div className="thank-you">
                <h3>✅ Thank you for reaching out!</h3>
                <p>We’ll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Type your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>

                <button type="submit">Send Message</button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>📍 123 Market Street, Mumbai, India</p>
            <p>📧 support@shopix.com</p>
            <p>📞 +91 98765 43210</p>

            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                🌐
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                🐦
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                📸
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
