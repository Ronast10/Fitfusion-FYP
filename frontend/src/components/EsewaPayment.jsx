import React from "react";
import "./EsewaPayment.css";

const EsewaPayment = ({ amount, itemName, onBack }) => {
  const handlePayment = async () => {
    try {
      // FIX: Ensure the amount has 2 decimal places before sending to backend
      const formattedAmount = Number(amount).toFixed(2);
      const transaction_uuid = `FF-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // 💡 FIX: Save whether this is a membership or shop item before leaving for eSewa
      const isMembership = itemName.toLowerCase().includes("membership") || itemName.toLowerCase().includes("plan");
      localStorage.setItem("paymentType", isMembership ? "membership" : "shop");

      const response = await fetch("http://localhost:5000/api/esewa/create-signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: formattedAmount, transaction_uuid }),
      });

      if (!response.ok) throw new Error("Failed to get signature from backend");
      
      const data = await response.json();

      const formFields = {
        amount: formattedAmount, 
        total_amount: formattedAmount,
        transaction_uuid: transaction_uuid,
        product_code: data.product_code,
        tax_amount: "0",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:5173/payment-success",
        failure_url: window.location.href, 
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: data.signature,
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

      Object.keys(formFields).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = formFields[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("eSewa Error:", err);
      alert("Failed to initialize eSewa. Please check your connection.");
    }
  };

  return (
    <div className="esewa-container">
      <button className="esewa-back-btn" onClick={onBack}>
        ← Back
      </button>

      <div className="esewa-logo-container">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp"
          alt="eSewa Logo"
          className="esewa-img"
        />
      </div>

      <div className="esewa-details">
        <p>You are paying for: <strong>{itemName}</strong></p>
        <h2 className="esewa-amount-text">Rs. {amount}</h2>
      </div>

      <button className="esewa-proceed-btn" onClick={handlePayment}>
        Proceed to eSewa
      </button>

      <p className="esewa-note">
        * You will be redirected to eSewa's secure payment page.
      </p>
    </div>
  );
};

export default EsewaPayment;