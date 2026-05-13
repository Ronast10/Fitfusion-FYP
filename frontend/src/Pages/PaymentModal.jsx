import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import "./PaymentModal.css";
import EsewaPayment from "../components/EsewaPayment";
import PaypalPayment from "../components/PaypalPayment";

const PaymentModal = ({ item, onClose }) => {
  const [view, setView] = useState("selection"); 
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  const getNumericPrice = (priceString) => {
    if (!priceString) return 0;
    const cleanNumber = parseFloat(priceString.toString().replace(/[^0-9.]/g, ''));
    return cleanNumber || 0;
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    const userEmail = localStorage.getItem("userEmail");
    const itemName = item.title || item.name || "";
    const isMembership = itemName.toLowerCase().includes("membership");

    try {
      if (isMembership) {
        // Call membership logic
        await axios.post(`${API_BASE_URL}/api/auth/verify-membership`, {
          email: userEmail,
          amount: getNumericPrice(item.price)
        });
      } else {
        // Call shop purchase logic
        await axios.post(`${API_BASE_URL}/api/auth/complete-purchase`, {
          email: userEmail
        });
        localStorage.removeItem("cart"); // Clear local storage for shop items
      }

      setIsProcessing(false);
      setView("success");
      
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to update Cart and Purchase History UI
      }, 3000);

    } catch (err) {
      console.error("Payment Verification Error:", err);
      setIsProcessing(false);
      alert("Payment verified, but account update failed. Please contact support.");
    }
  };

  const itemNameDisplay = item.title || item.name || "Fitness Item";

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-content" onClick={(e) => e.stopPropagation()}>
        <span className="payment-close" onClick={onClose}>&times;</span>

        {isProcessing && (
          <div className="processing-overlay">
            <div className="spinner"></div>
            <p>Verifying Transaction...</p>
          </div>
        )}

        {view === "selection" && (
          <>
            <h2 className="payment-title">Checkout</h2>
            <div className="item-summary-box">
              <p className="item-name">{itemNameDisplay}</p>
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
            </div>
          </>
        )}

        {view === "esewa" && (
          <EsewaPayment 
            amount={getNumericPrice(item.price)} 
            itemName={itemNameDisplay} 
            onBack={() => setView("selection")} 
            onSuccess={handlePaymentSuccess} // This now triggers the real DB update
          />
        )}

        {view === "success" && (
          <div className="payment-success">
            <div className="success-circle"><div className="success-check">✓</div></div>
            <h2>Transaction Complete</h2>
            <p>Order confirmed for <strong>{itemNameDisplay}</strong></p>
            <p className="redirect-text">
              {itemNameDisplay.toLowerCase().includes("membership") 
                ? "Finalizing your membership..." 
                : "Updating your purchase history..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;