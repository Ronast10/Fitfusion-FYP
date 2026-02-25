import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Landing.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";       
import Register from "./Register"; 
import Membership from "./Membership";
import PaymentModal from "./PaymentModal";

export default function Landing() {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [showLogin, setShowLogin] = useState(false); 
  const [showRegister, setShowRegister] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null); 
  const [openIndex, setOpenIndex] = useState(null);

  // --- DATA ---
  const faqData = [
    { q: "Do you offer personalized training programs?", a: "Yes! Our elite trainers design custom workout and nutrition plans tailored specifically to your body type and fitness goals." },
    { q: "How can I get started with a consultation?", a: "You can book a session directly through our Services section or contact our support team to schedule your first assessment." },
    { q: "What are the benefits of FitFusion membership?", a: "Members get exclusive access to digital tracking tools, premium training videos, and priority booking for our top-tier trainers." },
    { q: "Is FitFusion Nepal Suitable for Beginners?", a: "Absolutely! Whether you’re a beginner or an experienced fitness enthusiast, our gym caters to individuals of all fitness levels." }
  ];

  const trainers = [
    { id: "kishor-karki", name: "Kishor Karki", exp: "7 Years", role: "Prep Coach", img: "https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687" },
    { id: "sarah-tamang", name: "Sarah Tamang", exp: "5 Years", role: "Yoga Specialist", img: "https://images.unsplash.com/photo-1572621988687-3fe290e7c0f6?w=600" },
    { id: "arjun-thapa", name: "Arjun Thapa", exp: "8 Years", role: "Strength Coach", img: "https://images.unsplash.com/photo-1667890786327-d28da55b0e57?w=600" },
    { id: "binod-rai", name: "Binod Rai", exp: "6 Years", role: "Crossfit Expert", img: "https://images.unsplash.com/photo-1701481080490-cb2e7f4fd5f8?w=600" },
    { id: "deepa-gurung", name: "Deepa Gurung", exp: "4 Years", role: "Zumba Trainer", img: "https://images.unsplash.com/photo-1738870558728-720a366830a6?w=600" }
  ];

  // --- LOGIC ---
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") closeModals();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const openLoginModal = () => { closeModals(); setShowLogin(true); };
  const openRegisterModal = () => { closeModals(); setShowRegister(true); };
  const openPaymentModal = (item) => { closeModals(); setPaymentItem(item); };
  
  const closeModals = () => { 
    setShowLogin(false); 
    setShowRegister(false); 
    setPaymentItem(null); 
  };

  const scrollToMembership = () => {
    const section = document.getElementById("membership-section");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className={showLogin || showRegister || paymentItem ? "content-blur" : ""}>
        <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
        
        {/* HERO */}
        <section className="section hero" id="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>BUILD YOUR <span>LEGACY</span></h1>
              <h3>THE ULTIMATE FITNESS DESTINATION</h3>
              <button className="hero-btn" onClick={scrollToMembership}>START TODAY</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section about" id="about-section">
          <div className="about-container">
            <div className="about-text">
              <h2>FITFUSION NEPAL</h2>
              <h3>Your No.1 Choice For Fitness Management</h3>
              <p>
                "Welcome to FitFusion, Nepal's premier digital fitness ecosystem where technology meets elite physical performance. Join us today and experience the evolution of fitness management in Nepal."
              </p>
              <button className="about-btn" onClick={() => navigate("/shop")}>EXPLORE SHOP</button>
            </div>
            <div className="about-image-wrapper">
              <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069" alt="About" className="about-img"/>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services-section">
          <h2 className="services-title">SERVICES AND FACILITIES</h2>
          <div className="services-container">
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070" alt="PT" />
              <h3>PERSONAL TRAINERS</h3>
              <p>Expert support ensuring your fitness journey is transformative.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2070" alt="Online" />
              <h3>ONLINE COACHING</h3>
              <p>High-quality training sessions from anywhere.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053" alt="Nutrition" />
              <h3>NUTRITIONIST</h3>
              <p>Customized meal plans that fit your daily routine.</p>
            </div>
            <div className="service-card">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070" alt="Consult" />
              <h3>CONSULTATION</h3>
              <p>Professional advice through one-on-one sessions.</p>
            </div>
          </div>
        </section>

        {/* MEMBERSHIP */}
        <Membership onJoinClick={openPaymentModal} />
        
        {/* TRAINERS */}
        <section className="section trainers" id="trainers-section">
          <h2 className="trainers-title">MEET OUR TRAINERS</h2>
          <div className="trainers-container">
            {trainers.map((trainer) => (
              <div className="trainer-card" key={trainer.id}>
                <img src={trainer.img} alt={trainer.name} />
                <div className="trainer-overlay">
                  <h3>{trainer.name}</h3>
                  <p>{trainer.exp} Experience</p>
                  <p>{trainer.role}</p>
                  <div className="trainer-message-box" onClick={() => navigate(`/messages/${trainer.id}`)}>
                    <span className="msg-icon">💬</span><p>Message</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="faq-section" id="faq-section">
          <h2 className="faq-title">F.A.Q</h2>
          <div className="faq-container">
            {faqData.map((item, index) => (
              <div key={index} className={`faq-item ${openIndex === index ? "active" : ""}`} onClick={() => toggleFAQ(index)}>
                <div className="faq-question">
                  <span>{openIndex === index ? "−" : "+"}</span>
                  <h3>{item.q}</h3>
                </div>
                <div className="faq-answer"><p>{item.a}</p></div>
              </div>
            ))}
          </div>
        </section>

        <Footer />
      </div>

      {/* MODALS */}
      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-x" onClick={closeModals}>&times;</span>
            {showLogin && <Login switchToRegister={openRegisterModal} onLoginSuccess={closeModals} />}
            {showRegister && <Register switchToLogin={openLoginModal} />}
          </div>
        </div>
      )}

      {paymentItem && <PaymentModal item={paymentItem} onClose={closeModals} />}
    </>
  );
}