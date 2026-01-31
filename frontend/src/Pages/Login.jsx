import { useState } from "react";
import axios from "axios";
import "./Login.css";

// 1. Add onLoginSuccess to the props here
export default function Login({ switchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        
        // 2. REMOVE window.location.reload() and call the prop instead
        if (onLoginSuccess) {
          onLoginSuccess(); 
        }
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    }
  };

  return (
    <div className="login-card">
      <h1>FitFusion</h1>
      <p>Track your fitness, anytime, anywhere</p>

      {error && (
        <p style={{ 
          color: "#fff", 
          backgroundColor: "rgba(255, 71, 87, 0.2)", 
          border: "1px solid #ff4757",
          padding: "10px", 
          borderRadius: "8px", 
          fontSize: "13px",
          marginBottom: "15px" 
        }}>
          {error}
        </p>
      )}

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁" : "Ø"}
          </span>
        </div>

        <button type="submit">Login</button>
      </form>

      <p className="register-link">
        Don't have an account? <span onClick={switchToRegister}>Register</span>
      </p>
    </div>
  );
}