import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css"; // 
export default function Contact() {
  return (
    <div className="contact-page-wrapper">
      <Navbar />
      
      {/* Header Section like the Image */}
      <div className="contact-header">
        <h1>CONTACT US</h1>
      </div>

      <section className="contact-body">
        <div className="contact-content-grid">
          
          {/* Left Side: Info */}
          <div className="contact-info-side">
            <h2>You Can Find Us At</h2>
            <div className="info-block">
              <label>Email</label>
              <p>info@fitfusion.com.np</p>
            </div>
            <div className="info-block">
              <label>Phone Number</label>
              <p>+977-9876543210</p>
            </div>
            <div className="social-icons-contact">
              {/* Add social icons here */}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="contact-form-side">
            <h2>Get In Touch</h2>
            <p>If you want to learn more about us or have some queries, please send us a message here.</p>
            <form className="fitfusion-contact-form">
              <div className="input-row">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
              </div>
              <div className="input-row">
                <input type="text" placeholder="Phone Number" />
                <input type="text" placeholder="Subject" />
              </div>
              <textarea placeholder="Message" rows="6"></textarea>
              <button type="submit" className="submit-red-btn">SUBMIT</button>
            </form>
          </div>
          
        </div>
      </section>

      <Footer />
    </div>
  );
}