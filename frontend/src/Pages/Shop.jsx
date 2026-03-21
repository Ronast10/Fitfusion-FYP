import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Live Popup Notification
  const [notification, setNotification] = useState({ show: false, message: "" });

  // Static Categories
  const categories = [
    { name: "Whey Protein", img: "/Img/Whey.webp" },
    { name: "Creatine", img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop" },
    { name: "Mass Gainer", img: "https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1170&auto=format&fit=crop" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800" },
    { name: "Gym Clothing", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800" },
  ];

  // --- STATIC BEST SELLERS ---
  const bestSellers = [
    {
      _id: "static_1",
      name: "MuscleBlaze Biozyme Whey Protein",
      price: 6500,
      image: "/Img/MuscleBlazeWhey.webp"
    },
    {
      _id: "static_2",
      name: "Wellcore Micronized Creatine Monohydrate",
      price: 1800,
      image: "/Img/WellcoreCre.webp"
    },
    {
      _id: "static_3",
      name: "MuscleBlaze Creatine Monohydrate",
      price: 1550,
      image: "/Img/MuscleblazeCreatine.webp"
    },
    {
      _id: "static_4",
      name: "Optimum Nutrition Gold Standard Whey",
      price: 7200,
      image: "/Img/OptimumWhey.webp",
    },
    {
      _id: "static_5",
      name: "MuscleBlaze High Protein Mass Gainer",
      price: 4200,
      image: "/Img/MuscleBlazeMassgainer.webp",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.length > 0 ? res.data : bestSellers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(bestSellers);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Updated Add to Cart Logic with Database Sync
  const addToCart = async (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isItemInCart = cart.find((item) => item._id === product._id);

    if (isItemInCart) {
      setNotification({ show: true, message: "⚠️ Item already in cart!" });
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      
      // Update Local Storage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // SYNC WITH MONGODB (Only if logged in)
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userEmail = localStorage.getItem("userEmail");

      if (isLoggedIn && userEmail) {
        try {
          await axios.post("http://localhost:5000/api/auth/sync-cart", {
            email: userEmail,
            cartItems: updatedCart
          });
        } catch (err) {
          console.error("Failed to sync cart to database:", err);
        }
      }

      setNotification({ show: true, message: `✅ ${product.name} added!` });
    }

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: "" });
    }, 3000);
  };

  return (
    <div className="shop-container">
      <Navbar />

      {/* LIVE NOTIFICATION POPUP */}
      {notification.show && (
        <div className="shop-notification">
          {notification.message}
        </div>
      )}

      <div className="shop-hero">
        <img
          src="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1170&auto=format&fit=crop"
          alt="Fuel Your Fitness"
          className="hero-img"
        />
        <div className="hero-overlay">
          <h1>Fuel Your Fitness</h1>
        </div>
      </div>

      <section className="shop-section">
        <h2 className="section-title">Shop By Category</h2>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <div className="category-card" key={i}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section className="shop-section">
        <h2 className="section-title">Best Sellers</h2>
        {loading ? (
          <p style={{ color: "#fff", textAlign: "center" }}>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.map((item) => (
              <div className="product-card" key={item._id}>
                <div className="product-img-wrapper">
                    <img src={item.image} alt={item.name} />
                </div>
                <div className="product-info">
                    <h3>{item.name}</h3>
                    <p className="product-price">Rs. {item.price}</p>
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                    Add To Cart
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}