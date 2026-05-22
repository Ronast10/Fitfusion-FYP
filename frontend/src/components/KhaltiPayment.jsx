import React, { useState } from "react";
import "./EsewaPayment.css";

const KhaltiPayment = ({ amount, itemName, onBack }) => {
  const [loading, setLoading] = useState(false);

  const handleKhaltiPayment = async () => {
    setLoading(true);
    try {
      const userEmail = localStorage.getItem("userEmail") || "";
      const formattedAmount = Number(amount).toFixed(2);
      const transaction_uuid = `KF-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // FIX: Explicitly set local storage fallback right before hitting the server just in case
      const isMembership = itemName.toLowerCase().includes("membership") || itemName.toLowerCase().includes("plan");
      localStorage.setItem("paymentType", isMembership ? "membership" : "shop");

      const response = await fetch("http://localhost:5000/api/khalti/khalti-initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: formattedAmount,
          transaction_uuid: transaction_uuid,
          purchase_order_name: itemName,
          email: userEmail
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get a secure checkout link from the backend.");
      }

      const data = await response.json();

      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert("Could not process your checkout URL. Please try again.");
      }
    } catch (err) {
      console.error("Khalti Checkout Error:", err);
      alert("Failed to initialize Khalti payment. Please verify your connection setup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esewa-container">
      <button className="esewa-back-btn" onClick={onBack} disabled={loading}>
        ← Back
      </button>

      <div className="esewa-logo-container">
        <img
          src="\Img\Khalti.webp"
          alt="Khalti Logo"
          className="esewa-img"
          style={{ objectFit: "contain", maxHeight: "55px" }}
        />
      </div>

      <div className="esewa-details">
        <p>You are paying for: <strong>{itemName}</strong></p>
        <h2 className="esewa-amount-text" style={{ color: "#5c2d91" }}>Rs. {amount}</h2>
      </div>

      <button 
        className="esewa-proceed-btn" 
        onClick={handleKhaltiPayment}
        disabled={loading}
        style={{ backgroundColor: "#5c2d91" }}
      >
        {loading ? "Securing Portal..." : "Proceed to Khalti"}
      </button>

      <p className="esewa-note">
        * You will be safely routed away to Khalti's secure payment verification panel.
      </p>
    </div>
  );
};

export default KhaltiPayment;