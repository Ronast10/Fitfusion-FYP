import React, { useState } from "react";
import "./PaypalPayment.css"; // Separate CSS

const PaypalPayment = ({ amount, onBack, onSuccess }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className="gateway-container">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="gateway-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" />
      </div>
      <form onSubmit={handleSubmit} className="gateway-form">
        <div className="input-box">
          <label>Email Address</label>
          <input type="email" placeholder="example@gmail.com" required />
        </div>
        <div className="input-box">
          <label>Password</label>
          <input type="password" placeholder="********" required />
        </div>
        <button type="submit" className="paypal-submit-btn">
          Pay with PayPal
        </button>
      </form>
    </div>
  );
};

export default PaypalPayment;