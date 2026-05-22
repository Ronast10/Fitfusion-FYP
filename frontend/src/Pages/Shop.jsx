import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login"; 
import Register from "./Register";

export default function Shop() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const [activeCategory, setActiveCategory] = useState(null);

  const API_BASE_URL = "http://localhost:5000";

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLoginModal = () => {
    setShowLogin(true);
  };

  // Helper to handle image paths
  const formatImageUrl = (img) => {
    if (!img) return "/Img/placeholder.webp";
    if (img.startsWith("/uploads")) return `${API_BASE_URL}${img}`;
    return img;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/products`);
        setDbProducts(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Use these names EXACTLY in your Admin Dropdown
  const staticCategories = [
    { name: "Whey Protein", img: "/Img/Whey.webp" },
    { name: "Creatine", img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop" },
    { name: "Mass Gainer", img: "https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1170&auto=format&fit=crop" },
    { name: "Gym Clothing", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800" },
  ];

  // Logic to filter products for the Popup Modal
  const handleCategoryClick = (categoryName) => {
    const filtered = dbProducts.filter(p => p.category === categoryName);
    setActiveCategory({ name: categoryName, items: filtered });
  };

 const addToCart = async (product) => {

  // 1. Check login
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (!isLoggedIn) {
    setNotification({
      show: true,
      message: "❌ Please log in to add items to your cart!"
    });

    setTimeout(() =>
      setNotification({ show: false, message: "" }),
      3000
    );

    openLoginModal();
    return;
  }

  // 2. Get current cart
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // 3. Check if already exists
  const existingItem = cart.find(
    (item) => item._id === product._id
  );

  let updatedCart;

  if (existingItem) {

    // Increase quantity
    updatedCart = cart.map((item) =>
      item._id === product._id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setNotification({
      show: true,
      message: `✅ ${product.name} quantity updated!`
    });

  } else {

    // Add new item
    updatedCart = [
      ...cart,
      { ...product, quantity: 1 }
    ];

    setNotification({
      show: true,
      message: `✅ ${product.name} added!`
    });
  }

  // 4. Save to localStorage
  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );

  // 5. SYNC TO DATABASE
  try {

    const userEmail = localStorage.getItem("userEmail");

    await axios.post(
      `${API_BASE_URL}/api/auth/sync-cart`,
      {
        email: userEmail,
        cartItems: updatedCart
      }
    );

    console.log("Cart synced successfully");

  } catch (err) {

    console.error("DB cart sync failed:", err);

  }

  // 6. Hide notification
  setTimeout(() =>
    setNotification({ show: false, message: "" }),
    3000
  );
};

 return (
    <div className="shop-container">
      {/* 1. Pass the handlers as props to Navbar */}
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />

      {/* 2. Render the Modal Overlay */}
      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={() => {setShowLogin(false); setShowRegister(false);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-x" onClick={() => {setShowLogin(false); setShowRegister(false);}}>&times;</span>
            {showLogin && <Login switchToRegister={() => {setShowLogin(false); setShowRegister(true);}} onLoginSuccess={() => setShowLogin(false)} />}
            {showRegister && <Register switchToLogin={() => {setShowRegister(false); setShowLogin(true);}} />}
          </div>
        </div>
      )}
      {notification.show && <div className="shop-notification">{notification.message}</div>}

      {/* --- CATEGORY POPUP MODAL --- */}
      {activeCategory && (
        <div className="category-overlay" onClick={() => setActiveCategory(null)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveCategory(null)}>&times;</button>
            <h2>{activeCategory.name} Selection</h2>
            <div className="modal-grid">
              {activeCategory.items.length > 0 ? (
                activeCategory.items.map((item) => (
                  <div className="modal-item-card" key={item._id}>
                    <img src={formatImageUrl(item.image)} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price}</p>
                    <button onClick={() => addToCart(item)}>Add To Cart</button>
                  </div>
                ))
              ) : (
                <p style={{ color: "#fff", gridColumn: "1/-1", textAlign: "center", padding: "20px" }}>
                  No items found in {activeCategory.name}.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <div className="shop-hero">
        <img src="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1170&auto=format&fit=crop" alt="Hero" className="hero-img" />
        <div className="hero-overlay"><h1>Fuel Your Fitness</h1></div>
      </div>

      {/* 2. Categories Section (Middle) */}
      <section className="shop-section">
        <h2 className="section-title">Shop By Category</h2>
        <div className="category-grid">
          {staticCategories.map((cat, i) => (
            <div className="category-card" key={i} onClick={() => handleCategoryClick(cat.name)}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers Section (Bottom) */}
      <section className="shop-section">
        <h2 className="section-title">Best Sellers</h2>
        <div className="product-grid">
          {loading ? (
            <p style={{ color: "#fff" }}>Loading...</p>
          ) : (
            // FILTER: Only show products from DB where category is EXACTLY "Best Seller"
            dbProducts
              .filter(p => p.category === "Best Seller")
              .map((item) => (
                <div className="product-card" key={item._id}>
                  <div className="product-img-wrapper">
                    <img src={formatImageUrl(item.image)} alt={item.name} />
                  </div>
                  <div className="product-info">
                    <h3>{item.name}</h3>
                    <p className="product-price">Rs. {item.price}</p>
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                      Add To Cart
                    </button>
                  </div>
                </div>
              ))
          )}
          
          {/* If no Best Sellers in DB, you can keep your fallbacks here or remove them */}
          {dbProducts.filter(p => p.category === "Best Seller").length === 0 && !loading && (
             <p style={{ color: "#aaa", textAlign: "center", gridColumn: "1/-1" }}>
               No items marked as "Best Seller" yet.
             </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}