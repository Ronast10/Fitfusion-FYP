import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Profile.css";

export default function Profile() {
  const [name, setName] = useState("Fit User");
  const [selectedAvatar, setSelectedAvatar] = useState("avg1.png");
  const [streak, setStreak] = useState(0);
  const [lastLoggedDate, setLastLoggedDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const avatarOptions = ["avg1.png", "avg2.png", "avg3.png", "avg4.png"];

  const achievements = [
    { id: 1, title: "Starter", desc: "Log your first workout", icon: "🌱", requirement: 1 },
    { id: 2, title: "Consistent", desc: "Reach a 3-day streak", icon: "🔥", requirement: 3 },
    { id: 3, title: "Athlete", desc: "Reach a 7-day streak", icon: "🏆", requirement: 7 },
    { id: 4, title: "Warrior", desc: "Reach a 15-day streak", icon: "⚔️", requirement: 15 },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem("userEmail");
      
      if (!email) {
        console.error("No userEmail found in localStorage. Login again.");
        setLoading(false);
        return;
      }

      try {
        // Fetching from your user/:email route in auth.js
        const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
        console.log("Database Data Received:", res.data); // Debug check

        if (res.data) {
          // Match the exact keys from your MongoDB screenshot
          setName(res.data.name || "Fit User");
          setSelectedAvatar(res.data.avatar || "avg1.png");
          setStreak(res.data.streak || 0); 
          setLastLoggedDate(res.data.lastLoggedDate || "");
          
          // Keep Navbar in sync
          localStorage.setItem("userName", res.data.name);
          localStorage.setItem("userAvatar", res.data.avatar);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const updateBackendProfile = async (updates) => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await axios.put("http://localhost:5000/api/auth/update-profile", {
        email,
        ...updates,
      });

      if (res.data.success) {
        if (updates.name) localStorage.setItem("userName", updates.name);
        if (updates.avatar) localStorage.setItem("userAvatar", updates.avatar);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err) {
      console.error("Failed to sync profile:", err);
    }
  };

  const handleAvatarSelect = (imgName) => {
    setSelectedAvatar(imgName);
    updateBackendProfile({ avatar: imgName });
  };

  const saveName = () => {
    setIsEditing(false);
    updateBackendProfile({ name });
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

    updateBackendProfile({ 
      streak: newStreak, 
      lastLoggedDate: today 
    });
  };

  if (loading) return <div className="loading">Loading Profile Data...</div>;

  return (
    <div className="profile-page">
      <Navbar />
      <section className="profile-container">
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

        <div className="achievements-section">
          <h3>Your Achievements</h3>
          <div className="achievements-grid">
            {achievements.map((ach) => (
              <div key={ach.id} className={`achievement-card ${streak >= ach.requirement ? "unlocked" : "locked"}`}>
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