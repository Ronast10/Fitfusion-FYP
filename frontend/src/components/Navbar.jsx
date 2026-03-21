import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  // Check login statuses
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true"; 
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName");
  const userName = storedName || (userEmail ? userEmail.split('@')[0] : "User");
  const userAvatar = localStorage.getItem("userAvatar");

  // Update cart count from localStorage
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCount();
    // Listen for storage changes in other tabs/windows
    window.addEventListener("storage", updateCount);
    
    // Custom interval to check for changes on the same page
    const interval = setInterval(updateCount, 1000);

    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
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

            {/* ADMIN PANEL LINK */}
            {isAdmin && (
              <li 
                onClick={() => navigate("/admin-dashboard")} 
                style={{color: "#ff4757", fontWeight: "bold", cursor: "pointer"}}
              >
                Admin Panel
              </li>
            )}
            
            {/* CART ICON - Visible to everyone */}
            <li className="cart-nav-item" onClick={() => navigate("/cart")} style={{position: 'relative', cursor: 'pointer'}}>
              <span style={{fontSize: '1.2rem'}}>🛒</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </li>

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
              !isAdmin && <li onClick={onLoginClick} style={{cursor: 'pointer'}}>Login</li>
            )}
          </ul>
          
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