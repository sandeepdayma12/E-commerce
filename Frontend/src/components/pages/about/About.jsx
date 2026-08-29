import React from 'react'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <h1>About Our Store</h1>
        <p>Quality. Style. Service. Welcome to your favorite e-commerce destination.</p>
      </section>

      {/* About Content */}
      <section className="about-content">
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30" alt="About us" />
        </div>
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            At <strong>ShopEase</strong>, we believe shopping should be easy, enjoyable, and affordable.  
            Founded in 2020, our mission is to bring top-quality products to your doorstep with just a few clicks.
          </p>
          <p>
            From fashion to electronics, home essentials to gifts — we curate only the best for our customers.  
            Our team is passionate about creating a seamless shopping experience that you can trust.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <h2>Our Mission & Values</h2>
        <div className="mission-items">
          <div className="mission-box">
            <h3>🌍 Sustainability</h3>
            <p>We strive to minimize our environmental impact by using eco-friendly packaging and ethical sourcing.</p>
          </div>
          <div className="mission-box">
            <h3>💎 Quality</h3>
            <p>We partner with trusted suppliers to ensure every product meets our high standards of excellence.</p>
          </div>
          <div className="mission-box">
            <h3>🤝 Customer Care</h3>
            <p>Your satisfaction is our top priority. Our support team is here for you 24/7.</p>
          </div>
        </div>
      </section>

      {/* Story or Team Section */}
      <section className="about-story">
        <h2>Our Story</h2>
        <p>
          What started as a small online boutique has now grown into a full-fledged e-commerce platform  
          trusted by thousands of customers worldwide. Our journey is powered by innovation,  
          customer feedback, and a relentless pursuit of excellence.
        </p>
      </section>
    </div>
  )
}
