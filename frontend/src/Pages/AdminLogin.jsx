import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", { 
        adminID: email, 
        password: password 
      });

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        alert("Welcome, Boss!");
        navigate("/admin-dashboard");
      }
    } catch (err) {
      alert("Invalid Admin Credentials!");
    }
  };

  return (
    <div style={{ background: "#000", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleAdminLogin} style={{ background: "#111", padding: "50px", borderRadius: "10px", border: "1px solid #ff4757", width: "350px" }}>
        <h2 style={{ color: "#fff", textAlign: "center" }}>Admin Access</h2>
        <input type="email" placeholder="admin@gmail.com" style={{ width: "100%", padding: "12px", marginBottom: "15px" }} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", marginBottom: "25px" }} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#ff4757", color: "#fff", cursor: "pointer" }}>Login</button>
      </form>
    </div>
  );
}