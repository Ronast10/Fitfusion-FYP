import { useState } from "react";
import axios from "axios";
import "./Login.css";

export default function Register({ switchToLogin }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      if (response.status === 201) {
        switchToLogin(); // Move to login after success
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="login-card">
      <h1>FitFusion</h1>
      <p>Create your account</p>

      {error && <p className="error-box">{error}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "👁" : "Ø"}
          </span>
        </div>
        <button type="submit">Register</button>
      </form>

      <p className="register-link">
        Already have an account? <span onClick={switchToLogin}>Login</span>
      </p>
    </div>
  );
}