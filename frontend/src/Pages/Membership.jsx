import React from "react";
import "./Membership.css";

const Membership = ({ onJoinClick }) => {
  // Helper function to go back to the top
  const goBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const plans = [
    {
      title: "PRO PLAN",
      duration: "3 MONTHS",
      price: "Rs. 8,500",
      featured: false,
      perks: [
        "10% Flat Discount on FitFusion Shop",
        "One-Time Personalized Workout Plan",
        "Full Gym & Equipment Access",
        "Digital Progress Tracking",
      ],
    },
    {
      title: "ELITE PLAN",
      duration: "6 MONTHS",
      price: "Rs. 15,000",
      featured: true,
      badge: "BEST VALUE",
      perks: [
        "20% Flat Discount on FitFusion Shop",
        "One-Time Personalized Workout Plan",
        "Proper Guidance from Senior Trainers",
        "Full Gym & Equipment Access",
        "Priority Access to New Facilities",
      ],
    },
  ];

  return (
    <section className="membership-section" id="membership-section">
      {/* THE CROSS BUTTON TO GO BACK */}
      <span className="membership-close-x" onClick={goBackToTop}>&times;</span>

      <h2 className="section-title">
        CHOOSE YOUR <span>PLAN</span>
      </h2>
      <div className="membership-container">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`membership-card ${plan.featured ? "featured" : ""}`}
          >
            {plan.featured && <div className="featured-badge">{plan.badge}</div>}
            <div className="card-header">
              <h3>{plan.title}</h3>
              <p className="duration">{plan.duration}</p>
            </div>
            <div className="price-tag">{plan.price}</div>
            <ul className="perks-list">
              {plan.perks.map((perk, i) => (
                <li key={i}>✓ {perk}</li>
              ))}
            </ul>
            <button
              className={`membership-btn ${plan.featured ? "featured-btn" : ""}`}
              onClick={onJoinClick}
            >
              GET STARTED
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Membership;