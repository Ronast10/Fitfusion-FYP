import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Profile.css";

export default function Profile() {
  // 1. Lazy Initialization
  const [name, setName] = useState(() => localStorage.getItem("userName") || "Fit User");
  const [isEditing, setIsEditing] = useState(false);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("workoutStreak")) || 0);
  const [lastLoggedDate, setLastLoggedDate] = useState(() => localStorage.getItem("lastLoggedDate") || "");

  const avatarOptions = ["avg1.png", "avg2.png", "avg3.png", "avg4.png"];

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    const saved = localStorage.getItem("userAvatar");
    return avatarOptions.includes(saved) ? saved : "avg1.png";
  });

  // 2. Achievements Logic
  const achievements = [
    { id: 1, title: "Starter", desc: "Log your first workout", icon: "🌱", requirement: 1 },
    { id: 2, title: "Consistent", desc: "Reach a 3-day streak", icon: "🔥", requirement: 3 },
    { id: 3, title: "Athlete", desc: "Reach a 7-day streak", icon: "🏆", requirement: 7 },
    { id: 4, title: "Warrior", desc: "Reach a 15-day streak", icon: "⚔️", requirement: 15 },
  ];

  const updateBackendProfile = async (updatedName, updatedAvatar) => {
    try {
      const email = localStorage.getItem("userEmail");
      await axios.put("http://localhost:5000/api/auth/update-profile", {
        email,
        name: updatedName,
        avatar: updatedAvatar,
      });

      localStorage.setItem("userName", updatedName);
      localStorage.setItem("userAvatar", updatedAvatar);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  };

  const handleAvatarSelect = (imgName) => {
    setSelectedAvatar(imgName);
    updateBackendProfile(name, imgName);
  };

  const saveName = () => {
    setIsEditing(false);
    updateBackendProfile(name, selectedAvatar);
  };

  const logWorkout = () => {
    const today = new Date().toDateString();
    if (lastLoggedDate === today) {
      alert("Workout already logged for today!");
      return;
    }
    const newStreak = streak + 1;
    setStreak(newStreak);
    setLastLoggedDate(today);
    localStorage.setItem("workoutStreak", newStreak);
    localStorage.setItem("lastLoggedDate", today);
  };

  return (
    <div className="profile-page">
      <Navbar />
      <section className="profile-container">
        {/* Profile Info Card */}
        <div className="profile-card">
          <div className="avatar-selection-wrapper">
            <div className="current-avatar-display">
              <img src={`/avatars/${selectedAvatar}`} alt="Current" className="user-avatar" />
            </div>
            <p className="pick-text">Choose your Avatar</p>
            <div className="avatar-options-grid">
              {avatarOptions.map((opt) => (
                <img
                  key={opt}
                  src={`/avatars/${opt}`}
                  alt="Option"
                  className={`avatar-option ${selectedAvatar === opt ? "active-av" : ""}`}
                  onClick={() => handleAvatarSelect(opt)}
                />
              ))}
            </div>
          </div>

          <div className="user-info">
            {isEditing ? (
              <div className="edit-name">
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus />
                <button onClick={saveName}>Save</button>
              </div>
            ) : (
              <div className="display-name">
                <h2>Welcome back, <span>{name}</span></h2>
                <button onClick={() => setIsEditing(true)}>Edit Name</button>
              </div>
            )}
          </div>
        </div>

        {/* Workout Streak Section */}
        <div className="streak-section">
          <h3>Workout Streak</h3>
          <div className="streak-stats">
            <div className="streak-count">
              <span>{streak}</span>
              <p>Days Active</p>
            </div>
            <button className="log-btn" onClick={logWorkout}>Log Today's Workout</button>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section">
          <h3>Your Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`achievement-card ${streak >= ach.requirement ? "unlocked" : "locked"}`}
              >
                <div className="ach-icon">{ach.icon}</div>
                <div className="ach-text">
                  <h4>{ach.title}</h4>
                  <p>{ach.desc}</p>
                </div>
                {streak >= ach.requirement && <span className="badge-check">✅</span>}
              </div>
            ))}
          </div>
        </div>

      </section>
      <Footer />
    </div>
  );
}