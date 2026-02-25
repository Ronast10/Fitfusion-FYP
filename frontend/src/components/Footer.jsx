import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>About</li>
            <li>Services</li>
            <li>Gallery</li>
            <li>Blogs</li>
            <li>Contact</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Our Services</h4>
          <ul>
            <li>Nutritionist</li>
            <li>Group Classes</li>
            <li>Personal Trainers</li>
            <li>Cardio Vascular Zone</li>
            <li>Consultations</li>
            <li>Steam & Sauna</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Policy</h4>
          <ul>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>

          <p>📞 01-5919988</p>
          <p>✉️ info@fitfusion.com.np</p>
          <div className="social-icons">
             <span>🌐</span> <span>📸</span> <span>🐦</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 FITFUSION NEPAL</p>
      </div>
    </footer>
  );
};