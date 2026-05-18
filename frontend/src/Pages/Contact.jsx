import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios"; 
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "", 
    subject: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  
  // New state to manage the custom dynamic in-app notification component
  const [submitStatus, setSubmitStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ type: "loading", text: "Sending your message..." });

    try {
      const response = await axios.post("http://localhost:5000/api/contact/submit", formData);
      
      if (response.data.success) {
        // Updated: Replaced window.alert with interactive UI state changes
        setSubmitStatus({
          type: "success",
          text: "Message Sent Successfully."
        });
        
        setFormData({ 
          name: "", 
          email: "", 
          phoneNumber: "", 
          subject: "", 
          message: "" 
        });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      const errorMessage = error.response?.data?.message || "Server unreachable. Ensure backend is running on port 5000.";
      
      setSubmitStatus({
        type: "error",
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  React.useEffect(() => {
    // Only set a timer if there is actually message text showing and it's not still loading
    if (submitStatus.text && submitStatus.type !== "loading") {
      const timer = setTimeout(() => {
        setSubmitStatus({ type: "", text: "" }); // Clears the banner after 5 seconds
      }, 5000); // 5000 milliseconds = 5 seconds (change to 6000 for 6 seconds)

      // Clean up the timer if the component unmounts or if a new message comes in
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);
  
  return (
    <div className="contact-page-wrapper">
      <Navbar />
      
      <header className="contact-hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="subtitle">REACH OUT TO US</span>
            <h1>CONTACT <span>US</span></h1>
            <div className="red-divider"></div>
          </div>
        </div>
      </header>

      <section className="contact-section">
        <div className="contact-container">
          
          <div className="contact-sidebar">
            <div className="info-header">
              <h2>Find Us At</h2>
              <p>Stop by for a workout or drop us a line anytime.</p>
            </div>

            <div className="contact-card">
              <div className="card-icon">📧</div>
              <div className="card-text">
                <label>Email Address</label>
                <p>info@fitfusion.com.np</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon">📞</div>
              <div className="card-text">
                <label>Phone Number</label>
                <p>+977-9876543210</p>
              </div>
            </div>

            <div className="contact-card">
              <div className="card-icon">📍</div>
              <div className="card-text">
                <label>Location</label>
                <p>Kathmandu, Nepal</p>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <div className="form-header">
              <h2>Get In <span>Touch</span></h2>
              <p>Have a question? Our team typically responds within 2 hours.</p>
            </div>

            <form className="elite-contact-form" onSubmit={handleSubmit}>
              
              {/* --- NEW IN-APP WEBSITE POPUP CONTAINER --- */}
              {submitStatus.text && (
                <div className={`form-status-banner ${submitStatus.type}`}>
                  <span className="status-icon">
                    {submitStatus.type === "success" ? "✓" : submitStatus.type === "error" ? "✕" : "⏳"}
                  </span>
                    {submitStatus.text}
                </div>
              )}

              <div className="input-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  required 
                  onChange={handleChange} 
                  value={formData.name} 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  required 
                  onChange={handleChange} 
                  value={formData.email} 
                />
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  name="phoneNumber" 
                  placeholder="Phone Number" 
                  required 
                  onChange={handleChange} 
                  value={formData.phoneNumber} 
                />
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject" 
                  onChange={handleChange} 
                  value={formData.subject} 
                />
              </div>
              <textarea 
                name="message" 
                placeholder="How can we help you today?" 
                rows="6" 
                required 
                onChange={handleChange} 
                value={formData.message}
              ></textarea>
              <button type="submit" className="elite-submit-btn" disabled={loading}>
                {loading ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}