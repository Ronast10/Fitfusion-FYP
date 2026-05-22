import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import "./Tips.css";

export default function Tips() {
  const [filter, setFilter] = useState("All");
  const [videoData, setVideoData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // BMI States
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiAdvice, setBmiAdvice] = useState("");
  const [recommendedCategory, setRecommendedCategory] = useState(null);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos");
        setVideoData(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const calculateBMI = () => {
    if (!height || !weight) {
      alert("Please enter height and weight");
      return;
    }
    const heightMeter = height / 100;
    const bmi = (weight / (heightMeter * heightMeter)).toFixed(1);
    setBmiResult(bmi);

    if (bmi < 18.5) {
      setBmiCategory("Underweight");
      setBmiAdvice(`As a ${gender}, you should focus on a healthy surplus. We recommend our "Bulk" guides.`);
      setRecommendedCategory("Bulk");
    } else if (bmi >= 18.5 && bmi < 24.9) {
      setBmiCategory("Healthy Weight");
      setBmiAdvice("Great job! You are in the ideal range. We recommend 'Body Recomposition'.");
      setRecommendedCategory("Body Recomposition");
    } else if (bmi >= 25 && bmi < 29.9) {
      setBmiCategory("Overweight");
      setBmiAdvice("Focus on fat loss while preserving muscle with our 'Cut' strategies.");
      setRecommendedCategory("Cut");
    } else {
      setBmiCategory("Obese");
      setBmiAdvice("Health is wealth. Start with our 'Weight Loss' fundamentals.");
      setRecommendedCategory("Weight Loss");
    }
  };

  const categories = ["All", "Weight Gain", "Weight Loss", "Bulk", "Cut", "Bodybuilding", "Body Recomposition"];

  const filteredVideos = filter === "All" ? videoData : videoData.filter(v => v.category === filter);
  const recommendedVideos = videoData.filter(v => v.category === recommendedCategory);

  return (
    <div className="tips-page">
      {/* 1. Navbar with Modal Props */}
      <Navbar
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      {/* 2. Modal Overlay Logic */}
      {(showLogin || showRegister) && (
        <div className="modal-overlay" onClick={() => { setShowLogin(false); setShowRegister(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-x" onClick={() => { setShowLogin(false); setShowRegister(false); }}>&times;</span>
            {showLogin && (
              <Login
                switchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
                onLoginSuccess={() => setShowLogin(false)}
              />
            )}
            {showRegister && (
              <Register
                switchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
              />
            )}
          </div>
        </div>
      )}

      <section className="tips-hero">
        <h1>FITNESS <span>INTELLIGENCE</span></h1>
        <p>Your personalized blueprint for physical excellence.</p>
      </section>

      <section className="bmi-section">
        <div className="bmi-card-wrapper">
          <h2>Personalized Assessment</h2>
          <p className="bmi-subtext">Enter your details below to analyze your physique.</p>

          <div className="gender-selector">
            <button className={gender === "male" ? "active" : ""} onClick={() => setGender("male")}>MALE</button>
            <button className={gender === "female" ? "active" : ""} onClick={() => setGender("female")}>FEMALE</button>
          </div>

          <div className="bmi-input-area">
            <input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} />
            <input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
            <button className="analyze-btn" onClick={calculateBMI}>Analyze My Physique</button>
          </div>

          {bmiResult && (
            <div className="bmi-result-card">
              <div className="result-main">
                <span className="res-num">{bmiResult}</span>
                <span className="res-cat">{bmiCategory}</span>
              </div>
              <p className="res-advice">{bmiAdvice}</p>
            </div>
          )}
        </div>
      </section>

      {recommendedCategory && (
        <section className="recommendation-area">
          <div className="section-header">
            <span className="tag">FOR YOU</span>
            <h2>Recommended Path: {recommendedCategory}</h2>
          </div>
          <div className="video-grid">
            {recommendedVideos.map(video => (
              <div key={video._id} className="video-card recommended">
                <div className="iframe-container">
                  <iframe src={`https://www.youtube.com/embed/${video.videoId}`} title={video.title} allowFullScreen></iframe>
                </div>
                <h4>{video.title}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="video-explorer">
        <div className="browse-divider">
          <div className="line"></div>
          <span>Browse All Knowledge</span>
          <div className="line"></div>
        </div>

        <div className="filter-bar">
          {categories.map(cat => (
            <button key={cat} className={filter === cat ? "active" : ""} onClick={() => setFilter(cat)}>{cat}</button>
          ))}
        </div>

        <div className="video-grid">
          {loading ? <p>Loading videos...</p> : filteredVideos.map(video => (
            <div key={video._id} className="video-card">
              <div className="iframe-container">
                <iframe src={`https://www.youtube.com/embed/${video.videoId}`} title={video.title} allowFullScreen></iframe>
              </div>
              <h4>{video.title}</h4>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}