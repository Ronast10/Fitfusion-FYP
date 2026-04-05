import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import PaymentModal from "./PaymentModal";

import "./Membership.css";



const Membership = () => {

  const navigate = useNavigate();

  // State to track which plan the user wants to buy

  const [selectedPlan, setSelectedPlan] = useState(null);



  const plans = [

    {

      title: "PRO PLAN",

      duration: "3 MONTHS",

      price: "RS 4000",

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

      price: "RS 7000",

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

    <div className="membership-page">

      <Navbar />



      <section className="membership-section">

        {/* Back button to go back to landing */}

        <span className="membership-close-x" onClick={() => navigate("/")}>&times;</span>



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

              {/* This button now sets the state to open the Payment Modal */}

              <button

                className={`membership-btn ${plan.featured ? "featured-btn" : ""}`}

                onClick={() => setSelectedPlan(plan)}

              >

                GET STARTED

              </button>

            </div>

          ))}

        </div>

      </section>



      {/* If a plan is selected, show the Payment Modal.

         When the modal closes, we set selectedPlan back to null.

      */}

      {selectedPlan && (

        <PaymentModal

          item={selectedPlan}

          onClose={() => setSelectedPlan(null)}

        />

      )}



      <Footer />

    </div>

  );

};



export default Membership;