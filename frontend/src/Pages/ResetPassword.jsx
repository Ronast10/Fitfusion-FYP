import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ResetPassword.css"; 

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Track success state
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", { 
        token, 
        password 
      });
      
      setSuccess("Password updated successfully! Redirecting...");
      setTimeout(() => navigate("http://localhost:5173/"), 2000); // 2-second delay for professional UX
      
    } catch (err) {
      setError("Token is invalid or expired.");
    }
  };

  return (
    <div className="reset-page-wrapper">
      <div className="login-card">
        <h1>FITFUSION</h1>
        <p>Enter New Password</p>
        
        {error && <div className="login-error">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleReset}>
          {/* New Password */}
          <div className="input-group password-wrapper">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="New Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="input-group password-wrapper">
            <input 
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm New Password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <span className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          <button type="submit" className="login-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
}