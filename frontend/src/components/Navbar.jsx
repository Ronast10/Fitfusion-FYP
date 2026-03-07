import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();

  // Check login statuses
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true"; // Added for Admin check
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName");
  const userName = storedName || (userEmail ? userEmail.split('@')[0] : "User");
  const userAvatar = localStorage.getItem("userAvatar");

  const handleLogout = () => {
    // Completely clear all user and admin data
    localStorage.clear(); 
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

            {/* ADMIN PANEL LINK - Only visible if isAdmin is true */}
            {isAdmin && (
              <li 
                onClick={() => navigate("/admin-dashboard")} 
                style={{color: "#ff4757", fontWeight: "bold", cursor: "pointer"}}
              >
                Admin Panel
              </li>
            )}
            
            {isLoggedIn ? (
              <>
                <li 
                  className="user-profile nav-profile-active" 
                  onClick={() => navigate("/profile")}
                  style={{cursor: 'pointer'}}
                >
                  {userAvatar ? (
                    <img src={`/avatars/${userAvatar}`} alt="nav-avatar" className="nav-mini-avatar" />
                  ) : (
                    <span className="user-icon">👤</span>
                  )}
                  <span className="user-name">Hi, {userName}</span>
                </li>
                <li className="Logout-btn" onClick={handleLogout}>Logout</li>
              </>
            ) : (
              // If not a regular user, check if we should show login (hide if admin is already logged in)
              !isAdmin && <li onClick={onLoginClick} style={{cursor: 'pointer'}}>Login</li>
            )}
          </ul>
          
          {/* Hide JOIN NOW button if admin or user is logged in */}
          {!isLoggedIn && !isAdmin && (
            <button className="cta-button-nav" onClick={onRegisterClick}>
              JOIN NOW
            </button>
          )}
        </div>
      </nav>
    </>
  );
}