import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Login({ switchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data.user;

        // 1. SYNC CART: Load items from MongoDB into LocalStorage
        // This ensures the Navbar cart icon updates to show their saved items
        localStorage.setItem("cart", JSON.stringify(userData.cart || []));

        // 2. SET USER SESSION DATA
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userAvatar", userData.avatar || "avg1.png");
        
        // 3. Optional: Store Streak/Membership if you use them in the Dashboard
        localStorage.setItem("userStreak", userData.streak || 0);

        // 4. Trigger the success callback (usually closes the modal or redirects)
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }
    } catch (err) {
      // Handles specific error messages from your backend auth.js logic
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h1>FitFusion</h1>
      <p>Track your fitness, anytime, anywhere</p>

      {/* Error Message Display */}
      {error && (
        <div className="login-error">
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>

        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Verifying..." : "Login"}
        </button>
      </form>

      <div className="login-footer">
        <p>
          Don't have an account?{" "}
          <span className="link-text" onClick={switchToRegister}>
            Register Now
          </span>
        </p>
      </div>
    </div>
  );
}