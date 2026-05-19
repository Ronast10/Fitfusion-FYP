import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotificationToast from "./NotificationToast";
import "./Navbar.css";

export default function Navbar({ onLoginClick, onRegisterClick }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  
  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeToasts, setActiveToasts] = useState([]);

  // Check regular user login statuses strictly
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userEmail = localStorage.getItem("userEmail") || "";
  const storedName = localStorage.getItem("userName");
  const userName = storedName || (userEmail ? userEmail.split('@')[0] : "User");
  const userAvatar = localStorage.getItem("userAvatar");

  // MATCH DATABASE LOGIC: Use email or name as the primary tracking key
  const currentNotificationIdentifier = userEmail || storedName || "User";

  const API_BASE_URL = "http://localhost:5000";

  // Unified polling and tracker logic
  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.length);
    };

    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 1000);

    // Initial load for alerts using your account email/name identifier
    if (isLoggedIn && currentNotificationIdentifier) {
      fetchNotifications();
    }

    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, [isLoggedIn, currentNotificationIdentifier]);

  // Real-time live check loop for sliding toast popups
  useEffect(() => {
    let liveCheckInterval;
    if (isLoggedIn && currentNotificationIdentifier) {
      liveCheckInterval = setInterval(async () => {
        try {
          const res = await axios.get(
            `${API_BASE_URL}/api/notifications/${encodeURIComponent(currentNotificationIdentifier)}`
          );
          if (res.data.length > notifications.length) {
            const newNoti = res.data[0];
            setActiveToasts(prev => [...prev, newNoti]);
            setNotifications(res.data);
          }
        } catch (err) {
          console.error("Live notification ping failed:", err);
        }
      }, 7000); // Check for incoming alerts every 7 seconds
    }
    return () => clearInterval(liveCheckInterval);
  }, [isLoggedIn, currentNotificationIdentifier, notifications.length]);

  const fetchNotifications = async () => {
    if (!currentNotificationIdentifier) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/notifications/${encodeURIComponent(currentNotificationIdentifier)}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const toggleDropdown = async (e) => {
    e.stopPropagation(); // Stop click event propagation from closing immediately
    setShowDropdown(!showDropdown);
    
    if (!showDropdown && isLoggedIn && currentNotificationIdentifier) {
      try {
        await axios.put(
          `${API_BASE_URL}/api/notifications/mark-read/${encodeURIComponent(currentNotificationIdentifier)}`
        );
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      } catch (err) {
        console.error("Error marking read:", err);
      }
    }
  };

  // NEW: Handles individual notification target deletion from the UI state and server database
  const handleDeleteNotification = async (e, notificationId) => {
    e.stopPropagation(); // Prevents clicking the delete button from closing or navigating the dropdown menu
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/${notificationId}`);
      // Instantly filter out the item to refresh UI list smoothly
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (err) {
      console.error("Failed to delete notification record:", err);
    }
  };

  // Close dropdown if user clicks anywhere else on screen
  useEffect(() => {
    const closeMenu = () => setShowDropdown(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate("/"); 
    window.location.reload(); 
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
            
            {/* CART ICON - Visible to everyone */}
            <li className="cart-nav-item" onClick={() => navigate("/cart")} style={{position: 'relative', cursor: 'pointer'}}>
              <span style={{fontSize: '1.2rem'}}>🛒</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </li>

            {isLoggedIn ? (
              <>
                {/* 1. PROFILE SECTION */}
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

                {/* 2. NOTIFICATION BELL */}
                <li 
                  className="navbar-notification-wrapper" 
                  onClick={toggleDropdown}
                >
                  <span className="white-bell-icon">🔔</span>
                  {unreadCount > 0 && <span className="notification-badge-count">{unreadCount}</span>}
                  
                  {showDropdown && (
                    <div className="notification-panel-dropdown" onClick={(e) => e.stopPropagation()}>
                      <div className="dropdown-panel-header"><h4>Notifications</h4></div>
                      <div className="dropdown-scroll-body">
                        {notifications.length > 0 ? (
                          notifications.map(n => (
                            <div key={n._id} className={`dropdown-item-row ${!n.isRead ? "unread-row" : ""}`}>
                              
                              {/* NEW ACTION: Individual Item Clear Trigger Button */}
                              <button 
                                className="delete-noti-btn"
                                onClick={(e) => handleDeleteNotification(e, n._id)}
                              >
                                ✕
                              </button>

                              <strong>{n.senderName}</strong>
                              <p>{n.messagePreview}</p>
                            </div>
                          ))
                        ) : (
                          <p className="empty-notifications-text">No new notifications</p>
                        )}
                      </div>
                    </div>
                  )}
                </li>

                {/* 3. LOGOUT BUTTON */}
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

      {/* Real-time Sliding Toast Overlay Container */}
      <div className="notification-toast-container">
        {activeToasts.map((toast) => (
          <NotificationToast 
            key={toast._id} 
            notification={toast} 
            onClose={() => setActiveToasts(prev => prev.filter(t => t._id !== toast._id))} 
          />
        ))}
      </div>
    </>
  );
}