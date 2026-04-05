import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ switchToRegister, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      if (response.status === 200) {
        const userData = response.data.user;

        localStorage.setItem("cart", JSON.stringify(userData.cart || []));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("userName", userData.name);
        localStorage.setItem("userAvatar", userData.avatar || "avg1.png");
        localStorage.setItem("userStreak", userData.streak || 0);

        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email: resetEmail,
      });

      setResetMsg("Password reset link sent to your email.");
    } catch (err) {
      setResetMsg("Unable to send reset email.");
    }
  };

  return (
    <div className="login-card">
      <h1>FitFusion</h1>
      <p>Track your fitness, anytime, anywhere</p>

      {error && (
        <div className="login-error">
          {error}
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
          />
        </div>

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
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="forgot-password">
          <span onClick={() => setShowForgot(true)}>
            Forgot Password?
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

      {showForgot && (
        <div className="forgot-modal">
          <div className="forgot-box">
            <h3>Reset Password</h3>

            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />

              <button type="submit">Send Reset Link</button>
            </form>

            {resetMsg && <p className="reset-msg">{resetMsg}</p>}

            <button
              className="close-btn"
              onClick={() => setShowForgot(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}