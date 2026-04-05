import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentModal from "../pages/PaymentModal"; 
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  // Helper function to sync with MongoDB
  const syncCartToDB = async (updatedCart) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userEmail = localStorage.getItem("userEmail");

    if (isLoggedIn && userEmail) {
      try {
        await axios.post("http://localhost:5000/api/auth/sync-cart", {
          email: userEmail,
          cartItems: updatedCart,
        });
      } catch (err) {
        console.error("Failed to sync cart changes to DB:", err);
      }
    }
  };

  const updateQuantity = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    syncCartToDB(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    syncCartToDB(updatedCart);
  };

  // --- PRICING & DISCOUNT LOGIC ---
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Check membership status for discounts
  const status = (localStorage.getItem("userMembershipStatus") || "Free Member").toLowerCase();
  
  let discountPercent = 0;
  if (status.includes("pro")) discountPercent = 0.10; // 10% off
  if (status.includes("elite")) discountPercent = 0.20; // 20% off

  const discountAmount = subtotal * discountPercent;
  const finalTotal = subtotal - discountAmount;

  // FIX: Round to prevent eSewa decimal errors (e.g., 0.137 issue)
  const roundedTotal = Math.round(finalTotal);

  const cartOrderSummary = {
    name: "FitFusion Shop Order",
    price: `${roundedTotal}`, // Pass as clean string
    title: `${cartItems.length} Fitness Items`
  };

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Your Fitness Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty. Time to fuel up!</p>
            <button onClick={() => navigate("/shop")}>Go To Shop</button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item._id} className="cart-item-card">
                  <div className="cart-item-img-wrapper">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-price">Rs. {item.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <p className="subtotal">Rs. {item.price * item.quantity}</p>
                    <button className="remove-btn" onClick={() => removeItem(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              {discountPercent > 0 && (
                <div className="summary-row" style={{ color: "#2ed573", fontWeight: "600" }}>
                  <span>Member Discount ({discountPercent * 100}%)</span>
                  <span>- Rs. {Math.round(discountAmount)}</span>
                </div>
              )}

              <div className="summary-row">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span style={{ color: "#2ed573" }}>Rs. {roundedTotal}</span>
              </div>
              
              <button 
                className="checkout-btn" 
                onClick={() => setIsPaymentModalOpen(true)}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        )}
      </div>

      {isPaymentModalOpen && (
        <PaymentModal 
          item={cartOrderSummary} 
          onClose={() => setIsPaymentModalOpen(false)} 
        />
      )}

      <Footer />
    </div>
  );
}