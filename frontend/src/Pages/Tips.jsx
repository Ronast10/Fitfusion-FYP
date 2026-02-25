import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Tips.css";

export default function Tips() {
  const [filter, setFilter] = useState("All");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("male");
  const [bmiResult, setBmiResult] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiAdvice, setBmiAdvice] = useState("");
  const [recommendedCategory, setRecommendedCategory] = useState(null);

  const videoData = [
    { id: 1, title: "Complete Weight Gain Guide", category: "Weight Gain", videoId: "996mkJwILiQ" },
    { id: 2, title: "How to Gain Weight Fast & Healthy", category: "Weight Gain", videoId: "S21o1IdwWf8" },
    { id: 3, title: "High Calorie Diet Plan", category: "Weight Gain", videoId: "9T43EDBs1jw" },
    { id: 4, title: "Best Foods for Weight Gain", category: "Weight Gain", videoId: "lu_BObG6dj8" },
    { id: 5, title: "Science Based Fat Loss", category: "Weight Loss", videoId: "roHQ3F7d9YQ" },
    { id: 6, title: "Beginner Fat Loss Plan", category: "Weight Loss", videoId: "TuRv8gRfvb8" },
    { id: 7, title: "How to Lose Belly Fat", category: "Weight Loss", videoId: "uKXF3eS79_A" },
    { id: 8, title: "Complete Weight Loss Strategy", category: "Weight Loss", videoId: "LTM-tSGGhI4" },
    { id: 16, title: "How To Bulk Like A Pro", category: "Bulk", videoId: "OqRvmJ2eyBA" },
    { id: 17, title: "Best Bulking Strategies", category: "Bulk", videoId: "gygPB6RN-Rc" },
    { id: 11, title: "How to Cut Without Losing Muscle", category: "Cut", videoId: "DzjWEn2BS_k" },
    { id: 15, title: "Bodybuilding Simplified: Cutting", category: "Cut", videoId: "VWkLHxwfB94" },
    { id: 13, title: "Casually Explained: Bodybuilding", category: "Bodybuilding", videoId: "liTwZSJEzsE" },
    { id: 14, title: "Classic Physique Training Guide", category: "Bodybuilding", videoId: "wkBtHOBmpb0" },
    { id: 18, title: "The Secret to Burn Fat & Build Muscle", category: "Body Recomposition", videoId: "szm4Kx2CCyQ" }
  ];

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
      <Navbar />

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

          {/* FIXED RESULT BOX */}
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
              <div key={video.id} className="video-card recommended">
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
        {/* FIXED WHITE LINE DIVIDER */}
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
          {filteredVideos.map(video => (
            <div key={video.id} className="video-card">
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