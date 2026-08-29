import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section */}
        <div className="footer-section">
          <h2 className="footer-logo">
            Shop<span>ix</span>
          </h2>
          <p>Your one-stop destination for all your shopping needs.</p>
        </div>

        {/* Middle Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact</Link></li>
           
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-links">
            <Link to="https://facebook.com" target="_blank" rel="noreferrer">
              🌐 Facebook
            </Link>
            <Link to="https://twitter.com" target="_blank" rel="noreferrer">
              🐦 Twitter
            </Link>
            <Link to="https://instagram.com" target="_blank" rel="noreferrer">
              📸 Instagram
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Shopix. All rights reserved.</p>
      </div>
    </footer>
  )
}
