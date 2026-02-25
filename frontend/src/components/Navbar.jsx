import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();

  // Retrieve login status and user info
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail") || "";
  
  // 1. Priority: Use renamed name from profile, 2. Fallback: Email prefix
  const storedName = localStorage.getItem("userName");
  const userName = storedName || (userEmail ? userEmail.split('@')[0] : "User");

  // Retrieve avatar from profile (if uploaded)
  const userAvatar = localStorage.getItem("userAvatar");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    // Note: We keep userName and userAvatar so they persist for next login 
    // or you can clear them here if you want a fresh start.
    navigate("/"); 
    window.location.reload(); 
  };

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-content">
          <span>📞 +977-01-5919988</span>
          <span>✉️ info@fitfusion.com.np</span>
          <span>📱 +977-9876543210</span>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-container">
          <h2 className="logo" onClick={() => navigate("/")} style={{cursor: 'pointer'}}>
            FIT<span>FUSION</span>
          </h2>
          <ul>
            <li onClick={() => navigate("/")}>Home</li>
            <li onClick={() => navigate("/about")} style={{cursor: 'pointer'}}>About Us</li>
            <li onClick={() => navigate("/shop")}>Shop</li>
            <li onClick={() => navigate("/tips")}>Tips & Videos</li>
            <li onClick={() => navigate("/contact")}>Contact</li>
            
            {isLoggedIn ? (
              <>
                {/* CLICKING THIS NOW LOADS THE PROFILE PAGE */}
                <li 
                  className="user-profile nav-profile-active" 
                  onClick={() => navigate("/profile")}
                  style={{cursor: 'pointer'}}
                >
                  {userAvatar ? (
                    <img src={userAvatar} alt="nav-avatar" className="nav-mini-avatar" />
                  ) : (
                    <span className="user-icon">👤</span>
                  )}
                  <span className="user-name">Hi, {userName}</span>
                </li>
                <li className="Logout-btn" onClick={handleLogout}>Logout</li>
              </>
            ) : (
              <li onClick={onLoginClick} style={{cursor: 'pointer'}}>Login</li>
            )}
          </ul>
          
          {!isLoggedIn && (
            <button className="cta-button-nav" onClick={onRegisterClick}>
              JOIN NOW
            </button>
          )}
        </div>
      </nav>
    </>
  );
}