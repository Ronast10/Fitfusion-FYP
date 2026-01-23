import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar">
        <h2>FitFusion</h2>
        <ul>
          <li>Home</li>
          <li>Workouts</li>
          <li>Progress</li>
          <li>Profile</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>

      <header className="hero">
        <h1>Welcome to FitFusion 🚀</h1>
        <p>Your all-in-one fitness platform</p>
      </header>

      <section className="cards">
        <div className="card">🏋️‍♂️ Workout Plans</div>
        <div className="card">📊 Track Progress</div>
        <div className="card">🥗 Nutrition Guides</div>
      </section>
    </div>
  );
}
