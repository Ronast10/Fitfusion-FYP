import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./AdminLogin.css"; 

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Forgot Password States
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const navigate = useNavigate();

  const handleAdminAction = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isRegistering ? "register" : "login";
    
    try {
      const res = await axios.post(`http://localhost:5000/api/admin/${endpoint}`, { 
        email, 
        password 
      });

      if (res.data.success) {
        if (isRegistering) {
          setSuccess("Admin created successfully! Switching to login...");
          setEmail("");
          setPassword("");
          setTimeout(() => {
            setSuccess("");
            setIsRegistering(false);
          }, 2500);
        } else {
          localStorage.setItem("isAdmin", "true");
          setSuccess("Access authorized. Welcome back, Boss!");
          setTimeout(() => {
            navigate("/admin-dashboard");
          }, 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication credentials rejected.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/forgot-password", { email: resetEmail });
      setResetMsg("Password reset link sent to your email.");
    } catch (err) {
      setResetMsg("Error: Could not send reset link.");
    }
  };

  const toggleMode = () => {
    setError("");
    setSuccess("");
    setShowPassword(false);
    setIsRegistering(!isRegistering);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-card">
        <h2>{isRegistering ? "New Admin" : "Admin Access"}</h2>
        
        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        <form onSubmit={handleAdminAction}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
            required 
          />
          
          <div className="password-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading}
              required 
            />
            <span className="toggle-password" onClick={() => !loading && setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="admin-btn" disabled={loading}>
            {loading ? "Processing..." : isRegistering ? "Create Admin" : "Login"}
          </button>

          {!isRegistering && (
            <p className="forgot-trigger" onClick={() => setShowForgot(true)}>Forgot Password?</p>
          )}

          <p className="admin-footer-toggle">
            {isRegistering ? (
              <>Already an admin? <span onClick={toggleMode}>Login</span></>
            ) : (
              <>Need a new system profile? <span onClick={toggleMode}>Register Here</span></>
            )}
          </p>
        </form>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="forgot-modal">
          <div className="forgot-box">
            <h3>Reset Admin Password</h3>
            <form onSubmit={handleForgotPassword}>
              <input 
                type="email" 
                placeholder="Enter Admin Email" 
                value={resetEmail} 
                onChange={(e) => setResetEmail(e.target.value)} 
                required 
              />
              <button type="submit" className="admin-btn">Send Reset Link</button>
            </form>
            {resetMsg && <p className="msg">{resetMsg}</p>}
            <button className="close-btn" onClick={() => setShowForgot(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}