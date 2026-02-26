import React, { useState } from "react";
import "./EsewaPayment.css"; // Separate CSS

const EsewaPayment = ({ amount, onBack, onSuccess }) => {
  const [formData, setFormData] = useState({ id: "", pin: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess(); // Triggers success state in parent
  };

  return (
    <div className="gateway-container">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="gateway-logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp" alt="eSewa" />
      </div>
      <form onSubmit={handleSubmit} className="gateway-form">
        <div className="input-box">
          <label>eSewa ID (Mobile Number)</label>
          <input 
            type="text" 
            placeholder="98XXXXXXXX" 
            required 
            onChange={(e) => setFormData({...formData, id: e.target.value})}
          />
        </div>
        <div className="input-box">
          <label>MPIN</label>
          <input 
            type="password" 
            placeholder="****" 
            required 
            onChange={(e) => setFormData({...formData, pin: e.target.value})}
          />
        </div>
        <button type="submit" className="esewa-submit-btn">
          Login & Pay Rs. {amount}
        </button>
      </form>
    </div>
  );
};

export default EsewaPayment;