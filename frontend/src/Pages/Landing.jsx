import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Landing.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";       
import Register from "./Register"; 

export default function Landing() {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  // We set these to false so the landing page shows first without pop-ups
  const [showLogin, setShowLogin] = useState(false); 
  const [showRegister, setShowRegister] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    { q: "Do you offer personalized training programs?", a: "Yes! Our elite trainers design custom workout and nutrition plans tailored specifically to your body type and fitness goals." },
    { q: "How can I get started with a consultation?", a: "You can book a session directly through our Services section or contact our support team to schedule your first assessment." },
    { q: "What are the benefits of FitFusion membership?", a: "Members get exclusive access to digital tracking tools, premium training videos, and priority booking for our top-tier trainers." },
    { q: "Is FitFusion Nepal Suitable for Beginners?", a: "Absolutely! Whether you’re a beginner or an experienced fitness enthusiast, our gym caters to individuals of all fitness levels." }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Helper functions to switch between Login and Register
  const openLoginModal = () => { setShowRegister(false); setShowLogin(true); };
  const openRegisterModal = () => { setShowLogin(false); setShowRegister(true); };
  const closeModals = () => { setShowLogin(false); setShowRegister(false); };

  return (
    <>
      {/* 1. BLUR WRAPPER - Blurs everything except the modal */}
      <div className={showLogin || showRegister ? "content-blur" : ""}>
        <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
        
        {/* Hero Section */}
        <section className="section hero" id="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>BUILD YOUR <span>LEGACY</span></h1>
              <h3>THE ULTIMATE FITNESS DESTINATION</h3>
              <button className="hero-btn" onClick={openRegisterModal}>START TODAY</button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="section about" id="about-section">
          <div className="about-container">
            <div className="about-text">
              <h2>FITFUSION NEPAL</h2>
              <h3>Your No.1 Choice For Fitness Management</h3>
              <p>
                "Welcome to FitFusion, Nepal's premier digital fitness ecosystem where technology meets elite physical performance. We aren't just a platform; we are the bridge between world-class trainers and dedicated enthusiasts, providing the modern infrastructure necessary for you to take total control of your health journey. Join us today and experience the evolution of fitness management in Nepal."
              </p>
              <button className="about-btn" onClick={() => navigate("/shop")}>EXPLORE SHOP</button>
            </div>
            <div className="about-image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069"
                alt="Trainer providing class" 
                className="about-img"
              />
            </div>
          </div>
        </section>

        {/* Services and Facilities Section */}
        <section className="services" id="services-section">
          <h2 className="services-title">SERVICES AND FACILITIES</h2>
          <div className="services-container">
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070" alt="Personal Trainer" />
              <h3>PERSONAL TRAINERS</h3>
              <p>Our expert trainers provide specialized support ensuring your fitness journey is both fulfilling and transformative.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2070" alt="Online Classes" />
              <h3>ONLINE COACHING CLASSES</h3>
              <p>Access high-quality training sessions from anywhere with our interactive and engaging digital coaching platform.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053" alt="Nutritionist" />
              <h3>NUTRITIONIST</h3>
              <p>Work with qualified nutritionists to develop a customized plan that fits seamlessly into your daily routine.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070" alt="Consultation" />
              <h3>CONSULTATION</h3>
              <p>Get professional health and fitness advice through one-on-one sessions to map out your long-term success.</p>
            </div>
          </div>
        </section>
        
        {/* Trainers Section */}
        <section className="section trainers" id="trainers-section">
          <h2 className="trainers-title">MEET OUR TRAINERS</h2>
          <div className="trainers-container">
            {[
              { id: "kishor-karki", name: "Kishor Karki", exp: "7 Years", role: "Prep Coach", img: "https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687" },
              { id: "sarah-tamang", name: "Sarah Tamang", exp: "5 Years", role: "Yoga Specialist", img: "https://images.unsplash.com/photo-1572621988687-3fe290e7c0f6?w=600" },
              { id: "arjun-thapa", name: "Arjun Thapa", exp: "8 Years", role: "Strength Coach", img: "https://images.unsplash.com/photo-1667890786327-d28da55b0e57?w=600" },
              { id: "binod-rai", name: "Binod Rai", exp: "6 Years", role: "Crossfit Expert", img: "https://images.unsplash.com/photo-1701481080490-cb2e7f4fd5f8?w=600" },
              { id: "deepa-gurung", name: "Deepa Gurung", exp: "4 Years", role: "Zumba Trainer", img: "https://images.unsplash.com/photo-1738870558728-720a366830a6?w=600" }
            ].map((trainer) => (
              <div className="trainer-card" key={trainer.id}>
                <img src={trainer.img} alt={trainer.name} />
                <div className="trainer-overlay">
                  <h3>{trainer.name}</h3>
                  <p>{trainer.exp} Experience</p>
                  <p>{trainer.role}</p>
                  <div 
                    className="trainer-message-box" 
                    onClick={() => navigate(`/messages/${trainer.id}`)}
                  >
                    <span className="msg-icon">💬</span>
                    <p>Message</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section" id="faq-section">
          <h2 className="faq-title">F.A.Q</h2>
          <div className="faq-container">
            {faqData.map((item, index) => (
              <div 
                key={index} 
                className={`faq-item ${openIndex === index ? "active" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <span>{openIndex === index ? "−" : "+"}</span>
                  <h3>{item.q}</h3>
                </div>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* 2. MODAL OVERLAYS - Centered perfectly via CSS */}
      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-x" onClick={closeModals}>&times;</span>
            {showLogin && (
              <Login 
                switchToRegister={openRegisterModal} 
                onLoginSuccess={closeModals} 
              />
            )}
            {showRegister && (
              <Register 
                switchToLogin={openLoginModal} 
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}