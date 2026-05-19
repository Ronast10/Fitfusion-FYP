import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TrainerChatSection({ trainerSlug, trainerName }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // 1. Fetch and group messages into unique Student conversation tabs
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/messages");
      const incomingMessages = res.data.messages || res.data || [];
      
      if (incomingMessages.length > 0) {
        const unique = {};
        
        incomingMessages.forEach(msg => {
          const uid = msg.userId || "UnknownID";
          
          // 💡 THE FIX: If this conversation slot is empty, OR if we find a message 
          // actually written by the user, lock down their real student name!
          if (!unique[uid] || msg.senderRole === "user") {
            unique[uid] = {
              userId: uid,
              // Only use msg.senderName if it's from the user, otherwise keep what we have or fallback safely
              senderName: msg.senderRole === "user" 
                ? msg.senderName 
                : (unique[uid]?.senderName || "Anonymous User"),
              subject: msg.subject || unique[uid]?.subject || "General Inquiry"
            };
          }
        });
        setStudents(Object.values(unique));
      }
    } catch (err) { 
      console.error("Fetch Students Error:", err); 
    }
  };

  // 2. Fetch history for the selected active user chat room
  const fetchChatHistory = async () => {
    if (!selectedStudent) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/history/${trainerSlug}/${selectedStudent.userId}`);
      const history = res.data.messages || res.data || [];
      setMessages(history);
    } catch (err) {
      console.error("Error pulling database records:", err);
      setMessages([]); 
    }
  };

  // Initial Load & Sidebar Polling Sync
  useEffect(() => {
    fetchStudents(); 
    const sidebarInterval = setInterval(fetchStudents, 4000);
    return () => clearInterval(sidebarInterval); 
  }, [trainerSlug, trainerName]);

  // Chat Room Polling Sync
  useEffect(() => {
    fetchChatHistory(); 
    const historyInterval = setInterval(fetchChatHistory, 3000);
    return () => clearInterval(historyInterval); 
  }, [selectedStudent, trainerSlug]);

  const handleSend = async () => {
    if (!reply.trim() || !selectedStudent) return;
    
    const payload = {
      trainerId: trainerSlug, 
      userId: selectedStudent.userId,
      senderName: trainerName,  
      senderRole: "trainer",
      content: reply
    };

    try {
      const res = await axios.post("http://localhost:5000/api/messages/send", payload);
      
      if (res.data.success || res.status === 201 || res.status === 200) {
        const newMsg = {
          ...payload,
          _id: res.data.message && res.data.message._id ? res.data.message._id : Date.now().toString()
        };
        
        setMessages([...messages, newMsg]);
        setReply("");
      }
    } catch (err) {
      console.error("Send Error:", err);
    }
  };

  return (
    <div className="chat-section-layout">
      {/* SIDEBAR CONVERSATIONS COLUMN */}
      <div className="chat-sidebar">
        <h6 className="sidebar-title">Active Conversations</h6>
        {students.length === 0 && <p style={{ padding: "15px", color: "#666" }}>No active dialogues found.</p>}
        {students.map(s => (
          <div 
            key={s.userId} 
            onClick={() => setSelectedStudent(s)} 
            className={`student-list-item ${selectedStudent?.userId === s.userId ? 'selected-student' : ''}`}
          >
            <strong>{s.senderName}</strong>
            <div className="student-id-sub">Topic: {s.subject}</div>
          </div>
        ))}
      </div>

      {/* CHAT DISPLAY FEED */}
      <div className="chat-main-feed">
        <div className="messages-area">
          {selectedStudent ? (
            messages.map((m, index) => (
              <div 
                key={m._id || index} 
                className={`chat-bubble-row ${m.senderRole === 'trainer' ? 'trainer-side' : 'user-side'}`}
              >
                <div className={`chat-bubble ${m.senderRole === 'trainer' ? 'trainer-bubble' : 'user-bubble'}`}>
                  {m.content}
                </div>
              </div>
            ))
          ) : (
            <div className="no-chat-selected-placeholder">
              <p>💬 Select an active chat thread to view and send professional replies.</p>
            </div>
          )}
        </div>

        {/* DATA INPUT PANEL FOOTER */}
        {selectedStudent && (
          <div className="chat-input-bar">
            <input 
              className="chat-input-field" 
              value={reply} 
              onChange={e => setReply(e.target.value)}
              placeholder={`Type a message to ${selectedStudent.senderName}...`}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="chat-send-btn" onClick={handleSend}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
}