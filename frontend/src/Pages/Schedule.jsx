import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; // Ensure the path is correct
import Footer from "../components/Footer"; // Ensure the path is correct
import "./Schedule.css";

export default function Schedule() {
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/classes")
            .then(res => setClasses(res.data))
            .catch(err => console.error("Error fetching classes:", err));
    }, []);

    return (
        <>
            <Navbar />

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