import React, { useState } from "react";
import axios from "axios"; // Ensure axios is installed
import "./PaymentModal.css";
import EsewaPayment from "../components/EsewaPayment";
import KhaltiPayment from "../components/KhaltiPayment"; // 1. Import the new Khalti component

const PaymentModal = ({ item, onClose }) => {
  const [view, setView] = useState("selection"); 
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = "http://localhost:5000";

  const getNumericPrice = (priceString) => {
    if (!priceString) return 0;
    const cleanNumber = parseFloat(priceString.toString().replace(/[^0-9.]/g, ''));
    return cleanNumber || 0;
  };

  const itemNameDisplay = item.title || item.name || "Fitness Item";

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-content" onClick={(e) => e.stopPropagation()}>
        <span className="payment-close" onClick={onClose}>&times;</span>

        {view === "selection" && (
          <>
            <h2 className="payment-title">Checkout</h2>
            <div className="item-summary-box">
              <p className="item-name">{itemNameDisplay}</p>
              <p className="item-price">{item.price}</p>
            </div>

            <div className="payment-methods-container">
              <p className="method-label">Select Payment Method:</p>
              
              {/* eSewa Option */}
              <div className="method-row" onClick={() => setView("esewa")}>
                <div className="method-info">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Esewa_logo.webp" alt="eSewa" className="method-logo" />
                  <span>eSewa Wallet</span>
                </div>
                <div className="arrow-icon">→</div>
              </div>

              {/* 2. Khalti Option Row */}
              <div className="method-row" onClick={() => setView("khalti")} style={{ marginTop: "12px" }}>
                <div className="method-info">
                  <img 
                    src="\Img\Khalti.webp" 
                    alt="Khalti" 
                    className="method-logo" 
                    style={{ objectFit: "contain" }}
                  />
                  <span>Khalti Wallet</span>
                </div>
                <div className="arrow-icon">→</div>
              </div>

            </div>
          </>
        )}

        {/* 3. Render eSewa Component View */}
        {view === "esewa" && (
          <EsewaPayment 
            amount={getNumericPrice(item.price)} 
            itemName={itemNameDisplay} 
            onBack={() => setView("selection")} 
          />
        )}

        {/* 4. Render Khalti Component View */}
        {view === "khalti" && (
          <KhaltiPayment 
            amount={getNumericPrice(item.price)} 
            itemName={itemNameDisplay} 
            onBack={() => setView("selection")} 
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