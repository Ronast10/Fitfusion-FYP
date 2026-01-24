import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();



  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="landing-wrapper">
      {/* Top Contact Bar */}
      <div className="top-bar">
        <div className="top-bar-content">
          <span>📞 +977-01-5919988</span>
          <span>✉️ info@fitfusion.com.np</span>
          <span>📱 +977-9876543210</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <h2 className="logo">FIT<span>FUSION</span></h2>
          <ul>
            <li>Home</li>
            <li onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}>About Us</li>
            <li>Blog</li>
            <li>Profile</li>
            <li>Contact</li>
            <li className="logout-btn" onClick={handleLogout}>Logout</li>
          </ul>
          <button className="cta-button-nav">JOIN NOW</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>BUILD YOUR <span>LEGACY</span></h1>
            <h3>THE ULTIMATE FITNESS DESTINATION</h3>
            <button className="hero-btn">START TODAY</button>
          </div>
        </div>
      </header>

      {/* About/Info Section - Replaces the old boxes */}
      <section className="about-section" id="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>FITFUSION NEPAL</h2>
            <h3>Your No.1 Choice For Fitness Management</h3>
            <p>
              Welcome to FitFusion, Nepal's premier web-based fitness management system! 
              We bridge the gap between elite personal trainers and enthusiasts. 
              Unlike a traditional gym, we provide the digital infrastructure for 
              trainers to host classes and users to manage their fitness journey.
            </p>
            <p>
              Our platform features an integrated <strong>FitFusion Shop</strong> where 
              you can browse a curated selection of gym products, including wearable 
              tech, fitness apparel, and nutritional edibles.
            </p>
            <p>
              Access expert training videos, information hubs, and scheduled classes 
              all in one seamless interface designed to safeguard your health.
            </p>
            <button className="about-btn">EXPLORE SHOP</button>
          </div>
          <div className="about-image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069" 
              alt="Trainer providing class" 
              className="about-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}