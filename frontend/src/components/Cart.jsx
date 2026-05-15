import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentModal from "../pages/PaymentModal"; 
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [purchasedItems, setPurchasedItems] = useState([]); // New state for history
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000";
  const userEmail = localStorage.getItem("userEmail");

  const formatImageUrl = (img) => {
    if (!img) return "/Img/placeholder.webp";
    if (img.startsWith("/uploads")) return `${API_BASE_URL}${img}`;
    return img;
  };

  useEffect(() => {
    // Load current cart
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);

    // Fetch purchase history from DB
    if (userEmail) {
      axios.get(`${API_BASE_URL}/api/auth/user/${userEmail}`)
        .then(res => {
          setPurchasedItems(res.data.purchasedItems || []);
        })
        .catch(err => console.error("Error fetching history:", err));
    }
  }, []);

  const syncCartToDB = async (updatedCart) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn && userEmail) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/sync-cart`, {
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

  const handleCheckout = async() => {
    await syncCartToDB(cartItems);
    setIsPaymentModalOpen(true);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const status = (localStorage.getItem("userMembershipStatus") || "Free Member").toLowerCase();
  
  let discountPercent = 0;
  if (status.includes("pro")) discountPercent = 0.10;
  if (status.includes("elite")) discountPercent = 0.20;

  const discountAmount = subtotal * discountPercent;
  const roundedTotal = Math.round(subtotal - discountAmount);

  const cartOrderSummary = {
    type: "shop",
    name: "FitFusion Shop Order",
    price: `${roundedTotal}`,
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
                    <img src={formatImageUrl(item.image)} alt={item.name} />
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
                    <button className="remove-btn" onClick={() => removeItem(item._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row"><span>Subtotal</span><span>Rs. {subtotal}</span></div>
              {discountPercent > 0 && (
                <div className="summary-row" style={{ color: "#2ed573", fontWeight: "600" }}>
                  <span>Member Discount ({discountPercent * 100}%)</span>
                  <span>- Rs. {Math.round(discountAmount)}</span>
                </div>
              )}
              <div className="summary-row"><span>Shipping</span><span>Free</span></div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span style={{ color: "#2ed573" }}>Rs. {roundedTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
            </div>
          </div>
        )}

        {/* --- PURCHASE HISTORY SECTION (NEW) --- */}
        <div className="purchased-section mt-5">
          <h2 className="mb-4">Bought Items</h2>
          {purchasedItems.length === 0 ? (
            <p className="text-muted">You haven't purchased anything yet.</p>
          ) : (
            <div className="purchased-grid">
              {purchasedItems.map((item, index) => (
                <div key={index} className="purchased-item-mini">
                  <img src={formatImageUrl(item.image)} alt={item.name} />
                  <div className="mini-details">
                    <h4>{item.name}</h4>
                    <p>Bought on: {new Date(item.purchaseDate).toLocaleDateString()}</p>
                    <p className="text-success fw-bold">Rs. {item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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