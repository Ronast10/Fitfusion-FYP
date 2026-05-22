import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Login from "./Login";
import Register from "./Register";
import "./Schedule.css";

export default function Schedule() {
    const [classes, setClasses] = useState([]);
    // 1. Add modal state
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:5000/api/classes")
            .then(res => setClasses(res.data))
            .catch(err => console.error("Error fetching classes:", err));
    }, []);

    return (
        <>
            {/* 2. Pass the trigger functions to Navbar */}
            <Navbar 
                onLoginClick={() => setShowLogin(true)} 
                onRegisterClick={() => setShowRegister(true)} 
            />

            {/* 3. Add the Modal Overlay logic */}
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

            <div className="schedule-page">
                <div className="schedule-content">
                    <h1>WEEKLY TRAINING SCHEDULE</h1>

                    <div className="class-grid">
                        {classes.map((c) => (
                            <div className="class-card" key={c._id}>
                                {c.image && <img src={`http://localhost:5000${c.image}`} alt={c.title} />}
                                <div className="card-body">
                                    <h3>{c.title}</h3>
                                    <span className="focus">{c.focus}</span>
                                    <p className="meta">{c.day} • {c.time}</p>
                                    <p className="desc">{c.description}</p>
                                    <a href={c.link} target="_blank" rel="noreferrer" className="join-btn">JOIN CLASS</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}