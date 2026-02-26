import React, { useState } from "react";
import "./PaymentModal.css";
// Importing from your components folder
import EsewaPayment from "../components/EsewaPayment";
import PaypalPayment from "../components/PaypalPayment";
const PaymentModal = ({ item, onClose }) => {
  const [view, setView] = useState("selection"); // selection, esewa, paypal, success
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePaymentSuccess = () => {
    setIsProcessing(true);
    // Finalizing transaction state
    setTimeout(() => {
      setIsProcessing(false);
      setView("success");
      setTimeout(() => onClose(), 3000);
    }, 1500);
  };

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-content" onClick={(e) => e.stopPropagation()}>
        <span className="payment-close" onClick={onClose}>&times;</span>

        {/* STEP 1: Method Selection */}
        {view === "selection" && (
          <>
            <h2 className="payment-title">Checkout</h2>
            <div className="item-summary-box">
              <p className="item-name">{item.title || item.name}</p>
              <p className="item-price">{item.price}</p>
            </div>

            <div className="payment-methods-container">
              <p className="method-label">Select Payment Method:</p>
              
              <div className="method-row" onClick={() => setView("esewa")}>
                <div className="method-info">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp" alt="eSewa" className="method-logo" />
                  <span>eSewa Wallet</span>
                </div>
                <div className="arrow-icon">→</div>
              </div>

              <div className="method-row" onClick={() => setView("paypal")}>
                <div className="method-info">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="method-logo" />
                  <span>PayPal</span>
                </div>
                <div className="arrow-icon">→</div>
              </div>
            </div>
          </>
        )}

        {/* STEP 2: Detail Pages */}
        {view === "esewa" && (
          <EsewaPayment 
            amount={item.price} 
            onBack={() => setView("selection")} 
            onSuccess={handlePaymentSuccess} 
          />
        )}

        {view === "paypal" && (
          <PaypalPayment 
            amount={item.price} 
            onBack={() => setView("selection")} 
            onSuccess={handlePaymentSuccess} 
          />
        )}

        {/* STEP 3: Success State */}
        {view === "success" && (
          <div className="payment-success">
            <div className="success-circle">
              <div className="success-check">✓</div>
            </div>
            <h2>Transaction Complete</h2>
            <p>Order confirmed for <strong>{item.title || item.name}</strong></p>
            <p className="redirect-text">Finalizing your membership...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;