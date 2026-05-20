// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import axios from "axios";
import "./Register.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; 

export default function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added success state
  const [loading, setLoading] = useState(false); // Added loading flag for better UX

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      
      if (response.status === 201) {
        // Set the notification message here on the registration panel
        setSuccessMessage("Registration successful! A verification link has been sent to your email.");
        
        // Clear input values safely
        setFormData({ name: "", email: "", password: "" });

        // Delay the redirect so they can actually read it
        setTimeout(() => {
          switchToLogin();
        }, 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-card">
      <h1>FitFusion</h1>
      <p className="subtitle-text">Create your account</p>

      {/* High-visibility Error Banner */}
      {error && (
        <div className="login-error">
          {error}
        </div>
      )}

      {/* NEW: High-visibility Success/Verification Banner */}
      {successMessage && (
        <div className="register-success">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={loading || !!successMessage}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading || !!successMessage}
            required
          />
        </div>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading || !!successMessage}
            required
          />
          <span className="toggle-password" onClick={() => !successMessage && setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        
        <button type="submit" disabled={loading || !!successMessage}>
          {loading ? "Creating Account..." : successMessage ? "Redirecting..." : "Register"}
        </button>
      </form>

      <p className="register-link">
        Already have an account? <span onClick={switchToLogin}>Login</span>
      </p>
    </div>
  );
}