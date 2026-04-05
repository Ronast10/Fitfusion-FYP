import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Shop.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: "" });

  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { 
      name: "Whey Protein", 
      img: "/Img/Whey.webp",
      items: [
        { _id: "cat_p1", name: "Avvatar Isorich", price: 8500, image:"/Img/Avvatar.webp"},
        { _id: "cat_p2", name: "Grass- Fed Whey", price: 5000, image: "/Img/Grass.webp" },
        { _id: "cat_p3", name: "Naked Whey Protein", price: 6200, image: "/Img/Naked.webp" },
        { _id: "cat_p4", name: "Optimum Choice", price: 5500, image: "/Img/OptimumWhey.webp" },
        { _id: "cat_p5", name: "MuscleBlaze Whey", price: 7000, image: "/Img/MuscleBlazeWhey.webp" },
      ]
    },
    { 
      name: "Creatine", 
      img: "https://images.unsplash.com/photo-1693996045435-af7c48b9cafb?q=80&w=1170&auto=format&fit=crop",
      items: [
        { _id: "cat_c1", name: "WellCore", price: 2500, image: "/Img/WellcoreCre.webp" },
        { _id: "cat_c2", name: "Jacked Factory", price: 1800, image: "/Img/jacked.webp" },
        { _id: "cat_c3", name: "IsoPure", price: 2200, image: "/Img/isopure.webp" },
        { _id: "cat_c4", name: "Essentials", price: 2100, image: "/Img/essentials.webp" },
        { _id: "cat_c5", name: "Naked Creatine", price: 3500, image: "/Img/Nakcr.webp" },
      ]
    },
    
    { name: "Mass Gainer", img: "https://images.unsplash.com/photo-1693996046865-19217d179161?q=80&w=1170&auto=format&fit=crop", items: [
      { _id: "cat_c1", name: "Gnc Mass Gainer", price: 4500, image: "/Img/gncmass.webp" },
        { _id: "cat_c2", name: "Naked Mass", price: 3800, image: "/Img/nakedmass.webp" },
        { _id: "cat_c3", name: "Labrada", price: 2200, image: "/Img/lab.webp" },
        { _id: "cat_c4", name: "MuscleBlaze High Protein Mass Gainer", price: 4200, image: "/Img/MuscleBlazeMassgainer.webp" },
    ] },
    
    { name: "Gym Clothing", img: "https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?auto=format&fit=crop&w=800", items: [
      { _id: "cat_c1", name: "Compression shirt", price: 1500, image: "/Img/compressionShirt.webp" },
      { _id: "cat_c2", name: "half Compressions", price: 1200, image: "/Img/Half compressions.webp" },
      { _id: "cat_c3", name: "Tank Tops", price: 1000, image: "/Img/TankTops.webp" },
      { _id: "cat_c4", name: "Compresion Pants", price: 1500, image: "/Img/comppants.webp" },
      { _id: "cat_c5", name: "Compresion Shorts", price: 1200, image: "/Img/shorts.webp" },
    ] },
  ];

  const bestSellers = [
    { _id: "static_1", name: "MuscleBlaze Biozyme Whey Protein", price: 6500, image: "/Img/MuscleBlazeWhey.webp" },
    { _id: "static_2", name: "Wellcore Micronized Creatine Monohydrate", price: 1800, image: "/Img/WellcoreCre.webp" },
    { _id: "static_3", name: "MuscleBlaze Creatine Monohydrate", price: 1550, image: "/Img/MuscleblazeCreatine.webp" },
    { _id: "static_4", name: "Optimum Nutrition Gold Standard Whey", price: 7200, image: "/Img/OptimumWhey.webp" },
    { _id: "static_5", name: "MuscleBlaze High Protein Mass Gainer", price: 4200, image: "/Img/MuscleBlazeMassgainer.webp" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data.length > 0 ? res.data : bestSellers);
        setLoading(false);
      } catch (err) {
        setProducts(bestSellers);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const isItemInCart = cart.find((item) => item._id === product._id);

    if (isItemInCart) {
      setNotification({ show: true, message: "⚠️ Item already in cart!" });
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userEmail = localStorage.getItem("userEmail");

      if (isLoggedIn && userEmail) {
        try {
          await axios.post("http://localhost:5000/api/auth/sync-cart", {
            email: userEmail,
            cartItems: updatedCart
          });
        } catch (err) {
          console.error("Sync error:", err);
        }
      }
      setNotification({ show: true, message: `✅ ${product.name} added!` });
    }
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  return (
    <div className="shop-container">
      <Navbar />

      {notification.show && <div className="shop-notification">{notification.message}</div>}

      {/* --- CATEGORY POPUP OVERLAY --- */}
      {activeCategory && (
        <div className="category-overlay" onClick={() => setActiveCategory(null)}>
          <div className="category-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setActiveCategory(null)}>&times;</button>
            <h2>{activeCategory.name} Selection</h2>
            <div className="modal-grid">
              {activeCategory.items.length > 0 ? (
                activeCategory.items.map((item) => (
                  <div className="modal-item-card" key={item._id}>
                    <img src={item.image} alt={item.name} />
                    <h4>{item.name}</h4>
                    <p>Rs. {item.price}</p>
                    <button onClick={() => addToCart(item)}>Add</button>
                  </div>
                ))
              ) : (
                <p style={{ color: "#fff" }}>Coming Soon!</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="shop-hero">
        <img src="https://images.unsplash.com/photo-1683394572742-1e471f60fc2a?q=80&w=1170&auto=format&fit=crop" alt="Hero" className="hero-img" />
        <div className="hero-overlay"><h1>Fuel Your Fitness</h1></div>
      </div>

      <section className="shop-section">
        <h2 className="section-title">Shop By Category</h2>
        <div className="category-grid">
          {categories.map((cat, i) => (
            // Added onClick to set the active category
            <div className="category-card" key={i} onClick={() => setActiveCategory(cat)}>
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
                <div className="product-img-wrapper"><img src={item.image} alt={item.name} /></div>
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p className="product-price">Rs. {item.price}</p>
                  <button className="add-to-cart-btn" onClick={() => addToCart(item)}>Add To Cart</button>
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