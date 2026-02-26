import { useState } from "react";
import axios from "axios";
import "./Login.css";

// 1. Ensure onLoginSuccess is passed as a prop
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

      // 2. CHECK: Your backend response now includes the user object
      if (response.status === 200) {
        const userData = response.data.user;

        // Save everything to localStorage so the UI updates instantly
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        
        // ADD THESE: This prevents "Fit User" appearing on refresh
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userAvatar", userData.avatar || "avg1.png");
        
        // 3. Trigger the success callback to close the modal/redirect
        if (onLoginSuccess) {
          onLoginSuccess(); 
        }
      }
    } catch (err) {
      // Handles error messages from your auth.js logic
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