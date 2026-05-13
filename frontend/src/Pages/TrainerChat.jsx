import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./TrainerChat.css";

export default function TrainerChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const messageListRef = useRef(null);

  // Configuration - Ensure these match your DB exactly
  const currentTrainerName = "Ronast Acharya"; 
  const currentTrainerSlug = "ronast-acharya"; 
  const API_BASE = "http://localhost:5000/api";

  // 1. Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  // 2. Fetch unique students for the sidebar
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/messages`);
        if (res.data.success) {
          const uniqueUsers = {};
          res.data.messages.forEach(msg => {
            if (!uniqueUsers[msg.userId]) {
              uniqueUsers[msg.userId] = msg;
            }
          });
          setConversations(Object.values(uniqueUsers));
        }
      } catch (err) {
        console.error("Error fetching student list:", err);
      }
    };
    fetchConvos();
  }, []);

  // 3. Fetch history when a student is selected
  useEffect(() => {
    const fetchHistory = async () => {
      if (!selectedUser) return;
      
      const tSlug = selectedUser.trainerAssigned || selectedUser.trainerId || currentTrainerSlug;
      const uId = selectedUser.userId;

      try {
        const res = await axios.get(`${API_BASE}/messages/history/${tSlug}/${uId}`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("History fetch failed:", err);
      }
    };
    fetchHistory();
  }, [selectedUser]);

  // 4. Send Reply Logic (Fixed for Instant UI Update)
  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedUser) return;

    const payload = {
      trainerId: selectedUser.trainerAssigned || currentTrainerSlug,
      userId: selectedUser.userId,
      senderName: currentTrainerName,
      senderRole: "trainer",
      content: replyText
    };

    try {
      const res = await axios.post(`${API_BASE}/messages/send`, payload);
      
      if (res.data.success) {
        // USE SERVER DATA: res.data.message contains the real createdAt timestamp
        setMessages((prev) => [...prev, res.data.message]);
        setReplyText(""); // Clear input instantly
      }
    } catch (err) {
      console.error("Reply failed:", err.response?.data || err.message);
      alert("Failed to send message. Check console for details.");
    }
  };

  return (
    <div className="trainer-chat-page">
      <Navbar />
      <div className="trainer-chat-container">
        
        {/* SIDEBAR */}
        <div className="chat-sidebar">
          <div className="sidebar-header">
            <h3>Your Students</h3>
          </div>
          <div className="convo-list">
            {conversations.map((convo) => (
              <div 
                key={convo._id} 
                className={`convo-item ${selectedUser?.userId === convo.userId ? "active" : ""}`}
                onClick={() => setSelectedUser(convo)}
              >
                <div className="user-avatar">{convo.senderName ? convo.senderName[0] : "U"}</div>
                <div className="convo-info">
                  <p className="user-name">{convo.senderName}</p>
                  <p className="last-msg">To: {convo.trainerAssigned}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CHAT */}
        <div className="chat-main">
          {selectedUser ? (
            <>
              <div className="chat-header-main">
                <h2>Chatting with {selectedUser.senderName}</h2>
              </div>
              
              <div className="message-list" ref={messageListRef}>
                {messages.map((msg) => (
                  <div key={msg._id || Math.random()} className={`msg-wrapper ${msg.senderRole}`}>
                    <div className="msg-bubble">
                      <p>{msg.content}</p>
                      <span className="msg-time">
                        {msg.createdAt 
                          ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : "Sending..."}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="chat-input-area">
                <input 
                  value={replyText} 
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a professional reply..." 
                  onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
                />
                <button onClick={handleSendReply}>Send Reply</button>
              </div>
            </>
          ) : (
            <div className="no-select">
              <p>💬 Select a student to start the consultation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}