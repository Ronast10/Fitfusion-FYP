import React from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            {/* Use Link to instead of <a> or <li> text */}
            <li><Link to="/about">About</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Our Services</h4>
          <ul>
            <li>Nutritionist</li>
            <li>Group Classes</li>
            <li>Personal Trainers</li>
            <li>Consultations</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Policy</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>📞 01-5919988</p>
          <p>✉️ info@fitfusion.com.np</p>
          <div className="social-icons">
           
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 FITFUSION NEPAL</p>
      </div>
    </footer>
  );
};