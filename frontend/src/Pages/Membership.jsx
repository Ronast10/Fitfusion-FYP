import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PaymentModal from "./PaymentModal";
import "./Membership.css";

const Membership = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false); // Added for custom popup
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/user/${userEmail}`);
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching user status:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchUserStatus();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  // Updated to handle the custom modal confirmation
  const handleConfirmCancel = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/cancel-membership", { email: userEmail });
      setShowCancelModal(false);
      window.location.reload(); 
    } catch (err) {
      alert("Failed to cancel membership. Please try again.");
    }
  };

  const plans = [
    {
      type: "membership",
      title: "PRO PLAN",
      duration: "3 MONTHS",
      price: "RS 4000",
      featured: false,
      perks: [
        "10% Flat Discount on FitFusion Shop",
        "Personalized Workout Meal Plans",
        "Full Gym & Equipment Access",
        "Progress Tracking in the gym",
      ],
    },
    {
      type: "membership",
      title: "ELITE PLAN",
      duration: "6 MONTHS",
      price: "RS 7000",
      featured: true,
      badge: "BEST VALUE",
      perks: [
        "20% Flat Discount on FitFusion Shop",
        "Personalized Workout Meal Plans",
        "Proper Guidance from Senior Trainers",
        "Full Gym & Equipment Access",
        "Priority Access to New Facilities",
      ],
    },
  ];

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <div className="membership-page">
      <Navbar />

      <section className="membership-section">
        <span className="membership-close-x" onClick={() => navigate("/")}>&times;</span>

        {userData?.membershipData?.isMember ? (
          /* --- PROFESSIONAL DASHBOARD VIEW FOR MEMBERS --- */
          <div className="active-member-view">
            <div className="membership-glow-card">
              <div className="card-badge">ACTIVE MEMBER</div>
              <h2 className="welcome-title">Thank you for being a part of our <span>FitFusion Community!</span></h2>
              
              <div className="membership-info-box">
                <p>Hello, <strong>{userData.name}</strong>. We are thrilled to have you as a <strong>{userData.membershipData.membershipStatus}</strong>.</p>
                <p className="expiry-date">Your premium access is valid until: {new Date(userData.membershipData.planExpiry).toLocaleDateString()}</p>
              </div>

              <div className="professional-notice">
                <p>
                  If you wish to terminate your subscription, please use the button below. 
                  <strong> Regarding refunds:</strong> Please consult directly with the gym management. 
                  You can contact us through our <span onClick={() => navigate("/contact")} className="contact-link">Contact Section</span>.
                </p>
              </div>

              <div className="membership-actions">
                <button className="cancel-membership-btn" onClick={() => setShowCancelModal(true)}>
                  Cancel Membership
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* --- PRICING PLANS VIEW --- */
          <>
            <h2 className="section-title">
              CHOOSE YOUR <span>PLAN</span>
            </h2>

            <div className="membership-container">
              {plans.map((plan, index) => (
                <div key={index} className={`membership-card ${plan.featured ? "featured" : ""}`}>
                  {plan.featured && <div className="featured-badge">{plan.badge}</div>}
                  <div className="card-header">
                    <h3>{plan.title}</h3>
                    <p className="duration">{plan.duration}</p>
                  </div>
                  <div className="price-tag">{plan.price}</div>
                  <ul className="perks-list">
                    {plan.perks.map((perk, i) => <li key={i}>✓ {perk}</li>)}
                  </ul>
                  <button
                    className={`membership-btn ${plan.featured ? "featured-btn" : ""}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    GET STARTED
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* --- NEW IN-APP CONFIRMATION POPUP --- */}
      {showCancelModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-icon">⚠️</div>
            <h3>Cancel Membership?</h3>
            <p>Are you sure you want to cancel? Your discounts and premium perks will be removed immediately.</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmCancel}>Yes, Cancel</button>
              <button className="keep-btn" onClick={() => setShowCancelModal(false)}>Keep Membership</button>
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <PaymentModal item={selectedPlan} onClose={() => setSelectedPlan(null)} />
      )}

      <Footer />
    </div>
  );
};

export default Membership;