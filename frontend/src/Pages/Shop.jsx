import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Shop() {
  // State to hold products from the database
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Static Categories (These stay static as they act as filters/navigation)
  const categories = [
    { name: "Whey Protein", img: "https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?q=80&w=1170&auto=format&fit=crop" },
    { name: "Creatine", img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop" },
    { name: "Mass Gainer", img: "https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1170&auto=format&fit=crop" },
    { name: "Accessories", img: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=800" },
    { name: "Gym Clothing", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800" },
  ];

  // Fetch products from Backend on load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to Cart Logic
  const addToCart = (product) => {
    // 1. Get existing cart from localStorage or start empty
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    // 2. Check if item is already in cart
    const isItemInCart = cart.find((item) => item._id === product._id);

    if (isItemInCart) {
      alert("Item already in cart!");
    } else {
      // 3. Add new item and save back to localStorage
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div className="shop-container">
      <Navbar />

      {/* HERO SECTION */}
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

      {/* CATEGORIES SECTION */}
      <section className="shop-section">
        <h2>Shop By Category</h2>
        <div className="category-grid">
          {categories.map((cat, i) => (
            <div className="category-card" key={i}>
              <img src={cat.img} alt={cat.name} />
              <h3>{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* DYNAMIC PRODUCTS SECTION (Replaces Best Sellers) */}
      <section className="shop-section">
        <h2>Best Sellers</h2>
        {loading ? (
          <p style={{ color: "#fff", textAlign: "center" }}>Loading products...</p>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((item) => (
                <div className="product-card" key={item._id}>
                  {/* Note: item.image comes from your database model */}
                  <img src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price}</p>
                  <button className="add-to-cart-btn" onClick={() => addToCart(item)}>
                    Add To Cart
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: "#888", textAlign: "center", gridColumn: "1/-1" }}>
                No products found. Add some from the Admin Panel!
              </p>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}