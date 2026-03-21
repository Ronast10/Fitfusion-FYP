import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying Payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const data = searchParams.get("data");
      const email = localStorage.getItem("userEmail");

      if (!data || !email) {
        console.error("Missing payment data or user email");
        return navigate("/membership");
      }

      try {
        // --- UPDATED TO CALL YOUR ESEWA VERIFY ROUTE ---
        const res = await axios.post("http://localhost:5000/api/esewa/verify-payment", {
          data: data, // Send the raw base64 data to backend
          email: email // Send the email to link the payment to the user
        });

        // Check for 'COMPLETE' status which matches your esewa.js logic
        if (res.data.status === "COMPLETE") {
          setLoading(false);
          setStatus("✓ Payment Successful!");
          
          // Small delay so user sees the success message
          setTimeout(() => navigate("/profile"), 2000);
        } else {
          setStatus("Payment verification failed.");
          setTimeout(() => navigate("/membership"), 3000);
        }
      } catch (err) {
        console.error("Verification Error:", err);
        setStatus("Server error during verification.");
        setTimeout(() => navigate("/membership"), 3000);
      }
    };
    verify();
  }, [searchParams, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: "Arial" }}>
      <div style={{ 
        maxWidth: "400px", 
        margin: "0 auto", 
        padding: "40px", 
        borderRadius: "15px", 
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
      }}>
        <h2 style={{ color: loading ? "#333" : "green" }}>{status}</h2>
        {loading ? (
          <p>Connecting to eSewa to confirm your transaction...</p>
        ) : (
          <p>Your FitFusion membership is now active! Redirecting to your profile...</p>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;