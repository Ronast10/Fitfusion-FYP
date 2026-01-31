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
  // showLogin is set to true so it pops up immediately on page load
  const [showLogin, setShowLogin] = useState(true); 
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
      {/* 1. BLUR WRAPPER - This div blurs the background when a modal is active */}
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
                "Welcome to FitFusion, Nepal's premier digital fitness ecosystem where technology meets elite physical performance. We aren't just a platform; we are the bridge between world-class trainers and dedicated enthusiasts, providing the modern infrastructure necessary for you to take total control of your health journey. Whether you are an athlete seeking specialized coaching or a beginner taking your first step, FitFusion empowers you with the tools, the community, and the expert guidance needed to transform your lifestyle. From our curated gear shop to real-time class scheduling and high-impact training videos, every feature is engineered to safeguard your health and amplify your results. At FitFusion, we don't just help you work out—we help you build a lasting legacy through consistency, expert knowledge, and a commitment to excellence. Join us today and experience the evolution of fitness management in Nepal."
              </p>
              <button className="about-btn">EXPLORE SHOP</button>
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
            <div className="trainer-card">
              <img src="https://images.unsplash.com/photo-1696563996353-214a3690bb11?q=80&w=687" alt="Trainer 1" />
              <div className="trainer-overlay">
                <h3>Kishor Karki</h3>
                <p>7 Years Experience</p>
                <p>Prep Coach</p>
              </div>
            </div>
            <div className="trainer-card">
              <img src="https://images.unsplash.com/photo-1572621988687-3fe290e7c0f6?w=600" alt="Trainer 2" /> 
              <div className="trainer-overlay">
                <h3>Sarah Tamang</h3>
                <p>5 Years Experience</p>
                <p>Yoga Specialist</p>
              </div>
            </div>
            <div className="trainer-card">
              <img src="https://images.unsplash.com/photo-1667890786327-d28da55b0e57?w=600" alt="Trainer 3" />
              <div className="trainer-overlay">
                <h3>Arjun Thapa</h3>
                <p>8 Years Experience</p>
                <p>Strength Coach</p>
              </div>
            </div>
            <div className="trainer-card">
              <img src="https://images.unsplash.com/photo-1701481080490-cb2e7f4fd5f8?w=600" alt="Trainer 4" />
              <div className="trainer-overlay">
                <h3>Binod Rai</h3>
                <p>6 Years Experience</p>
                <p>Crossfit Expert</p>
              </div>
            </div>
            <div className="trainer-card">
              <img src="https://images.unsplash.com/photo-1738870558728-720a366830a6?w=600" alt="Trainer 5" />
              <div className="trainer-overlay">
                <h3>Deepa Gurung</h3>
                <p>4 Years Experience</p>
                <p>Zumba Trainer</p>
              </div>
            </div>
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

      {/* 2. MODAL OVERLAYS - Outside the content-blur div */}
      {showLogin && (
  <div className="modal-overlay">
    <div className="modal-content">
      {/* Passing handleLoginSuccess to the Login component */}
      <Login 
        switchToRegister={openRegisterModal} 
        onLoginSuccess={() => {
          setShowLogin(false); // This hides the modal
          navigate("/");       // This ensures you are on the landing page
        }} 
      />
    </div>
  </div>
)}

      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            
            <Register switchToLogin={openLoginModal} />
          </div>
        </div>
      )}
    </>
  );
}