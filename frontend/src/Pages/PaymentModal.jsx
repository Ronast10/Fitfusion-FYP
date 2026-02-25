import React, { useState } from "react";
import "./PaymentModal.css";

const PaymentModal = ({ item, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Close modal automatically after showing success for 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-content" onClick={(e) => e.stopPropagation()}>
        <span className="payment-close" onClick={onClose}>&times;</span>
        
        {!isSuccess ? (
          <>
            <h2 className="payment-title">Checkout</h2>
            <div className="item-details">
              <p className="item-name">{item.title || item.name}</p>
              <p className="item-price">{item.price}</p>
            </div>

            <div className="payment-methods">
              <p>Select Payment Method:</p>
              <div className="method-option active">
                <span className="icon">💳</span> Digital Wallet / Card
              </div>
            </div>

            <button 
              className={`pay-now-btn ${isProcessing ? "loading" : ""}`} 
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "PAY NOW"}
            </button>
          </>
        ) : (
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your order for {item.title || item.name} is confirmed.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;