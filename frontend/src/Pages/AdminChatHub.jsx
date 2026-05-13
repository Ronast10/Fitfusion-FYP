import React, { useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import TrainerChatSection from "../components/TrainerChatSection";
import "./AdminChatHub.css";

export default function AdminChatHub() {
  const [view, setView] = useState(null);

  return (
    <div className="admin-chat-hub bg-black min-vh-100 text-white">
      {/* Pass the admin name prop so it's not blank */}
      <AdminNavbar adminName="Ronast (Admin)" />
      
      <div className="container py-5">
        <h2 className="text-center mb-4">Trainer Communication Hub</h2>
        <div className="row text-center">
          <div className="col-md-6 mb-3">
            <div className={`card p-4 bg-dark text-white shadow ${view === 'ronast-acharya' ? 'border-success' : 'border-secondary'}`}
                 onClick={() => setView('ronast-acharya')} style={{ cursor: 'pointer', transition: '0.3s' }}>
              <h3>Ronast Acharya</h3>
              <p className="text-success">Senior Trainer Desk</p>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className={`card p-4 bg-dark text-white shadow ${view === 'ismarika-bista' ? 'border-success' : 'border-secondary'}`}
                 onClick={() => setView('ismarika-bista')} style={{ cursor: 'pointer', transition: '0.3s' }}>
              <h3>Ismarika Bista</h3>
              <p className="text-info">Fitness Consultant Desk</p>
            </div>
          </div>
        </div>

        {view ? (
          <div className="mt-5 animate__animated animate__fadeIn">
            <TrainerChatSection 
              trainerSlug={view} 
              trainerName={view === 'ronast-acharya' ? 'Ronast Acharya' : 'Ismarika Bista'} 
            />
          </div>
        ) : (
          <div className="text-center mt-5 text-secondary">
            <h4>Select a trainer desk to manage student inquiries</h4>
          </div>
        )}
      </div>
    </div>
  );
}