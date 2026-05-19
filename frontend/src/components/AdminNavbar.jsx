import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminNavbar.css";

export default function AdminNavbar({ adminName, activeTab, onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="admin-nav">
      <div
        className="logo"
        onClick={() => navigate("/admin-dashboard")}
        style={{ cursor: "pointer" }}
      >
        FIT<span className="logo-highlight">FUSION</span> ADMIN
      </div>

      <ul className="admin-links">
        <li
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => navigate("/admin-dashboard")}
        >
          Dashboard
        </li>
        <li
          className={activeTab === "trainer" ? "active" : ""}
          onClick={() => navigate("/admin/chat")}
        >
          Trainer Inquiries
        </li>
      </ul>

      <div className="admin-profile-section">
        <div className="admin-profile">
          <span>Logged in as: <strong>{adminName}</strong></span>
        </div>
        {/* Render the logout button if the onLogout action is passed in */}
        {onLogout && (
          <button className="nav-logout-btn" onClick={onLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}