import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle state
  const navigate = useNavigate();

  const handleAdminAction = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? "register" : "login";
    
    try {
      const res = await axios.post(`http://localhost:5000/api/admin/auth/${endpoint}`, { 
        email: email, // Backend expects email
        password: password 
      });

      if (res.data.success) {
        if (isRegistering) {
          alert("Admin Created! Now please login.");
          setIsRegistering(false);
        } else {
          localStorage.setItem("isAdmin", "true");
          alert("Welcome, Boss!");
          navigate("/admin-dashboard");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action Failed!");
    }
  };

  return (
    <div style={{ background: "#000", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleAdminAction} style={{ background: "#111", padding: "50px", borderRadius: "10px", border: "1px solid #ff4757", width: "350px" }}>
        <h2 style={{ color: "#fff", textAlign: "center" }}>{isRegistering ? "New Admin" : "Admin Access"}</h2>
        
        <input type="email" placeholder="Admin Email" style={{ width: "100%", padding: "12px", marginBottom: "15px" }} 
          onChange={(e) => setEmail(e.target.value)} required />
        
        <input type="password" placeholder="Password" style={{ width: "100%", padding: "12px", marginBottom: "25px" }} 
          onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit" style={{ width: "100%", padding: "12px", background: "#ff4757", color: "#fff", cursor: "pointer", border: "none" }}>
          {isRegistering ? "Create Admin" : "Login"}
        </button>

        <p style={{ color: "#888", textAlign: "center", marginTop: "15px", cursor: "pointer" }} 
           onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? "Already an admin? Login" : "Need to create a new admin account?"}
        </p>
      </form>
    </div>
  );
}