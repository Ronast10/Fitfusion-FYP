import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import "./About.css";

export default function About() {
  // Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="about-page">
      {/* 1. Navbar with Modal Props */}
      <Navbar 
        onLoginClick={() => setShowLogin(true)} 
        onRegisterClick={() => setShowRegister(true)} 
      />

      {/* 2. Modal Overlay Logic */}
      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={() => {setShowLogin(false); setShowRegister(false);}}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-x" onClick={() => {setShowLogin(false); setShowRegister(false);}}>&times;</span>
            {showLogin && (
              <Login 
                switchToRegister={() => {setShowLogin(false); setShowRegister(true);}} 
                onLoginSuccess={() => setShowLogin(false)} 
              />
            )}
            {showRegister && (
              <Register 
                switchToLogin={() => {setShowRegister(false); setShowLogin(true);}} 
              />
            )}
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <header className="about-hero">
        <div className="about-hero-overlay">
          <h1>THE STORY BEHIND <span>FITFUSION</span></h1>
          <p>Innovating Fitness. Empowering Lives.</p>
        </div>
      </header>

      {/* --- MISSION SECTION --- */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-image">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" alt="FitFusion Gym" />
          </div>
          <div className="mission-text">
            <h3>OUR MISSION</h3>
            <h2>Bridging the Gap Between <span>Technology</span> and <span>Training</span></h2>
            <p>
              Founded in the heart of Nepal, FitFusion was born out of a simple realization: 
              fitness management shouldn't be complicated. We set out to create an ecosystem 
              where elite physical coaching meets cutting-edge digital tracking.
            </p>
            <p>
              Whether you are stepping into a gym for the first time or preparing for a 
              professional competition, FitFusion provides the tools, the community, and 
              the expertise to help you build your legacy.
            </p>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="values-section">
        <h2 className="section-title">WHY CHOOSE US?</h2>
        <div className="values-grid">
          <div className="value-item">
            <div className="value-icon">🎯</div>
            <h3>Precision Coaching</h3>
            <p>Every body is different. Our trainers focus on data-driven results tailored to your unique physiology.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">⚡</div>
            <h3>Digital First</h3>
            <p>Track your progress, book sessions, and access nutrition plans all from our seamless digital platform.</p>
          </div>
          <div className="value-item">
            <div className="value-icon">🤝</div>
            <h3>Community Driven</h3>
            <p>Join a tribe of like-minded individuals who push each other toward greatness every single day.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}