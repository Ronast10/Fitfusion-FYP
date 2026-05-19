import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import TrainerChatSection from "../components/TrainerChatSection";
import "./AdminChatHub.css";

export default function AdminChatHub() {
  const [view, setView] = useState(null);

  return (
    <div className="admin-chat-hub">
      <AdminNavbar adminName="Ronast (Admin)" />
      
      <div className="hub-content-wrapper">
        <h2 className="hub-main-title">Trainer Communication Hub</h2>
        
        {/* Main Selection Grid */}
        <div className="trainer-selection-grid">
          <div 
            className={`trainer-card ${view === 'ronast-acharya' ? 'selected' : ''}`}
            onClick={() => setView('ronast-acharya')}
          >
            <h3>Ronast Acharya</h3>
            <span className="desk-tag senior-desk">Senior Trainer Desk</span>
          </div>

          <div 
            className={`trainer-card ${view === 'ismarika-bista' ? 'selected' : ''}`}
            onClick={() => setView('ismarika-bista')}
          >
            <h3>Ismarika Bista</h3>
            <span className="desk-tag consultant-desk">Fitness Consultant Desk</span>
          </div>
        </div>

        {/* Dynamic chat section display container */}
        {view ? (
          <div className="active-chat-container">
            <TrainerChatSection 
              trainerSlug={view} 
              trainerName={view === 'ronast-acharya' ? 'Ronast Acharya' : 'Ismarika Bista'} 
            />
          </div>
        ) : (
          <div className="hub-placeholder-text">
            <h4>Select a trainer desk to manage student inquiries</h4>
          </div>
        )}
      </div>
    </div>
  );
}