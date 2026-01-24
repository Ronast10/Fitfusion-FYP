import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
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
            {/* 1. Change path to "/" to match your new Landing route */}
            <li onClick={() => navigate("/")}>Home</li>
            
            {/* 2. Update these to your Landing page IDs if using scrolling, or keep for subpages */}
            <li onClick={() => navigate("/")}>About Us</li>
            
            <li>Blog</li>
            <li>Profile</li>
            
            {/* 3. Add the Contact click handler */}
            <li onClick={() => navigate("/contact")}>Contact</li>
            
            <li className="logout-btn" onClick={handleLogout}>Logout</li>
          </ul>
          <button className="cta-button-nav" onClick={() => navigate("/register")}>JOIN NOW</button>
        </div>
      </nav>
    </>
  );
}