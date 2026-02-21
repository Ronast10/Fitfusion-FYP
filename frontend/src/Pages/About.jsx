import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  const stats = [
    { label: "Active Members", value: "500+" },
    { label: "Expert Trainers", value: "15+" },
    { label: "Success Stories", value: "1.2k" },
    { label: "Digital Plans", value: "200+" }
  ];

  return (
    <div className="about-page">
      <Navbar />

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

      {/* --- STATS COUNTER --- */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h2>{stat.value}</h2>
              <p>{stat.label}</p>
            </div>
          ))}
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