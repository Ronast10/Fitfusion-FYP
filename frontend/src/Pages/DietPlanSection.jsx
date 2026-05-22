import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import { dietPlans } from "../dietPlans";
import "./DietPlan.css";

export default function DietPlanPage() {
    const status = localStorage.getItem("userMembershipStatus");
    const isPremium = status === "Pro Member" || status === "Elite Member";
    
    // State for generated plan
    const [weightClass, setWeightClass] = useState("");
    const [goal, setGoal] = useState("");
    const [plan, setPlan] = useState(null);

    // NEW: State for modals
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const handleGenerate = () => {
        if (weightClass && goal) {
            setPlan(dietPlans[weightClass][goal]);
            document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Please select both your weight class and goal.");
        }
    };

    return (
        <div className="diet-page-container">
            {/* Pass modal handlers to Navbar */}
            <Navbar 
                onLoginClick={() => setShowLogin(true)} 
                onRegisterClick={() => setShowRegister(true)} 
            />

            {/* Modal Overlay Logic */}
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

            <section className="hero-section">
                <h1>FITFUSION DIET GENERATOR</h1>
                <p>Precision Nutrition, Simplified. We calculate the macros, you see the results.</p>
            </section>

            <main className="main-content">
                {!isPremium ? (
                    <div className="locked-msg">
                        <p>🔒 This content is for Pro & Elite members only.</p>
                        <button onClick={() => window.location.href = '/membership'}>Upgrade Now</button>
                    </div>
                ) : (
                    <>
                        <div className="controls">
                            <select onChange={(e) => setWeightClass(e.target.value)} value={weightClass}>
                                <option value="">Select Weight</option>
                                {Object.keys(dietPlans).map(c => <option value={c} key={c}>{c} kg</option>)}
                            </select>
                            <select onChange={(e) => setGoal(e.target.value)} value={goal}>
                                <option value="">Select Goal</option>
                                <option value="cutting">Cutting</option>
                                <option value="bulking">Bulking</option>
                            </select>
                            <button onClick={handleGenerate}>GENERATE</button>
                        </div>

                        <div id="result-section">
                            {plan && (
                                <div className="diet-card-premium">
                                    <img src={plan.image} alt="Plan" className="plan-image" />
                                    <div className="content-side">
                                        <div className="plan-header">
                                            <h3>{goal.toUpperCase()} PLAN ({weightClass} kg)</h3>
                                            <div className="stats-badge">Calories: {plan.calories}</div>
                                        </div>

                                        <div className="meal-breakdown">
                                            {Object.entries(plan.meals).map(([meal, desc]) => (
                                                <p key={meal}><strong>{meal}:</strong> {desc}</p>
                                            ))}
                                        </div>
                                        <div className="pro-tip">💡 <strong>Pro-Tip:</strong> {plan.tip}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}