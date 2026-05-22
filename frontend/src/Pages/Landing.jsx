import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Landing.css"; 
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";       
import Register from "./Register"; 

export default function Landing() {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [showLogin, setShowLogin] = useState(false); 
  const [showRegister, setShowRegister] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const [toastMsg, setToastMsg] = useState("");

  // --- DATA ---
  const faqData = [
    { q: "Do you offer personalized training programs?", a: "Yes! Our elite trainers design custom workout and nutrition plans tailored specifically to your body type and fitness goals." },
    { q: "How can I get started with a consultation?", a: "You can book a session directly through our Services section or contact our support team to schedule your first assessment." },
    { q: "What are the benefits of FitFusion membership?", a: "Members get exclusive access to digital tracking tools, premium training videos, and priority booking for our top-tier trainers." },
    { q: "Is FitFusion Nepal Suitable for Beginners?", a: "Absolutely! Whether you’re a beginner or an experienced fitness enthusiast, our gym caters to individuals of all fitness levels." }
  ];

  const trainers = [
    { id: "ronast-acharya", name: "Ronast Acharya", exp: "6 Years", role: "Crossfit Expert", img: "https://images.unsplash.com/photo-1701481080490-cb2e7f4fd5f8?w=600" },
    { id: "ismarika-bista", name: "Ismarika Bista", exp: "4 Years", role: "Zumba Trainer", img: "https://images.unsplash.com/photo-1738870558728-720a366830a6?w=600" }
  ];

  const handleMembershipClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
      setToastMsg("Please log in to purchase a membership!");
      setTimeout(() => setToastMsg(""), 3000);
      openLoginModal();
      return;
    }

    navigate("/membership");
  };

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
  
  const closeModals = () => { 
    setShowLogin(false); 
    setShowRegister(false); 
  };
 
  const handleMessage = (trainerId) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    // FIX: Look for the correct key
    const status = localStorage.getItem("userMembershipStatus");

    if (!isLoggedIn) {
      setToastMsg("Please log in to perform this action!");
      setTimeout(() => setToastMsg(""), 3000);
      openLoginModal();
      return;
    }
 
    // If status is "Pro" or "Elite", this condition will be false (allowing access)
    if (!status || status === "Free Member") {
      setToastMsg("Become a member to gain access to trainer messaging!");
      setTimeout(() => setToastMsg(""), 3000);
      return;
    }

    navigate(`/messages/${trainerId}`);
  };

  return (
    <>
    {toastMsg && (
  <div className="toast-container">
    <div className="custom-toast">
      {toastMsg}
    </div>
  </div>
)}
      <div className={showLogin || showRegister ? "content-blur" : ""}>
        <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
        
        {/* HERO */}
        <section className="section hero" id="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>BUILD YOUR <span>LEGACY</span></h1>
              <h3>THE ULTIMATE FITNESS DESTINATION</h3>
              {/* UPDATED: Navigates to membership page instead of scrolling */}
              <button className="hero-btn" onClick={handleMembershipClick}>START TODAY</button>
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
                "Welcome to FitFusion—Nepal’s premier digital fitness ecosystem where cutting-edge technology converges with elite physical performance. We aren't just a platform; we are a movement. By bridging the gap between world-class expertise and your personal dedication, we provide the modern infrastructure you need to master your health. Join us today and lead the evolution of fitness management in Nepal."
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
          
          {/* UPDATED: Calling the handleMessage function instead of direct navigation */}
          <div 
            className="trainer-message-box" 
            onClick={() => handleMessage(trainer.id)}
            style={{ cursor: 'pointer' }}
          >
            <span className="msg-icon">💬</span>
            <p>Message</p>
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
    </>
  );
}