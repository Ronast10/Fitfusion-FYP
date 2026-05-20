// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // options: verifying, success, error
  const [message, setMessage] = useState("Validating your authentic credentials, please wait...");
  const navigate = useNavigate();

  useEffect(() => {
    const triggerVerification = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        setMessage("Invalid verification process sequence: Missing security entry token.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(response.data.message || "Your email account has been verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification processing failed. The activation link may have expired.");
      }
    };

    triggerVerification();
  }, [searchParams]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "450px", width: "100%", padding: "40px", textAlign: "center", backgroundColor: "#fff", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", borderTop: status === "success" ? "5px solid #2ed573" : status === "error" ? "5px solid #ff4757" : "5px solid #ffa502" }}>
        
        {status === "verifying" && <h2 style={{ color: "#ffa502" }}>⏳ Verifying Email...</h2>}
        {status === "success" && <h2 style={{ color: "#2ed573" }}>✅ Account Activated!</h2>}
        {status === "error" && <h2 style={{ color: "#ff4757" }}>❌ Verification Failed</h2>}

        <p style={{ margin: "20px 0", color: "#555", fontSize: "15px", lineHeight: "1.6" }}>{message}</p>

        {status === "success" && (
          <p style={{ fontWeight: "bold", color: "#2ed573", marginTop: "20px" }}>
            You are verified! You can now go back to your original page and login.
          </p>
        )}
      </div>
    </div>
  );
}