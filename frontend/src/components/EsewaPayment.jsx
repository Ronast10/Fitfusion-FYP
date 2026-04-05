import React from "react";
import "./EsewaPayment.css"; // Ensure this path is correct

const EsewaPayment = ({ amount, onBack }) => {
  const handlePayment = async () => {
    try {
      // 1. Clean the amount (eSewa v2 is strict: no extra decimals)
      const formattedAmount = parseInt(amount).toString();
      const transaction_uuid = `FF-${Date.now()}`;

      // 2. Fetch signature from your Node backend
      const response = await fetch("http://localhost:5000/api/esewa/create-signature", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ amount: formattedAmount, transaction_uuid }),
});

const data = await response.json();

const formFields = {
  amount: formattedAmount,
  tax_amount: "0",
  total_amount: formattedAmount,
  transaction_uuid,
  product_code: data.product_code,
  product_service_charge: "0",
  product_delivery_charge: "0",
  success_url: "http://localhost:5173/payment-success",
  failure_url: "http://localhost:5173/membership",
  signed_field_names: "total_amount,transaction_uuid,product_code",
  signature: data.signature,
};

      // 4. Create and submit the hidden form
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.target = "_self";

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
      alert("Failed to initialize eSewa. Please try again.");
    }
  };

  return (
    <div className="esewa-container">
      {/* Back button to return to method selection */}
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
        <p>You are paying </p>
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