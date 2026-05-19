import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Messages.css";

export default function Messages() {
  const { trainerName } = useParams(); // e.g., "sarah-tamang"
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  // Dynamic session extraction matching your flat localStorage setup
  const userId = localStorage.getItem("userEmail"); 
  const userName = localStorage.getItem("userName"); 
  
  const API_BASE = "http://localhost:5000/api/messages";

  // 💡 THE FIX: Isolated function to pull history repeatedly for live syncing
  const fetchChatHistory = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/history/${trainerName}/${userId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Could not pull live message records:", err);
    }
  };

  // 1. Initial History Load & Background Live Polling Sync
  useEffect(() => {
    fetchChatHistory(); // Load data instantly when component mounts

    // 💡 Checks the database every 3 seconds for new responses from the trainer
    const liveSyncInterval = setInterval(fetchChatHistory, 3000);

    // Clean up the memory tracker interval when the user navigates away
    return () => clearInterval(liveSyncInterval);
  }, [trainerName, userId]);

  const handleSendMessage = async () => {
    if (inputText.trim() === "" || !userId || !userName) return;

    const payload = {
      trainerId: trainerName,
      userId: userId,        
      senderName: userName,  
      senderRole: "user",
      content: inputText
    };

    try {
      const res = await axios.post(`${API_BASE}/send`, payload);
      if (res.data.success) {
        // Reads the real saved database message object seamlessly
        const freshMsg = res.data.message && typeof res.data.message === 'object' 
          ? res.data.message 
          : { ...payload, _id: Date.now().toString(), createdAt: new Date() };

        setMessages([...messages, freshMsg]);
        setInputText("");
      }
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  return (
    <div className="messages-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <h2>Conversation with {trainerName.replace("-", " ")}</h2>
        </div>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={msg._id || index} className={`message-wrapper ${msg.senderRole}`}>
              <div className="message-bubble">
                <p>{msg.content}</p>
                <div className="message-info">
                  <span>
                    {msg.createdAt 
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  </span>
                  {msg.senderRole === "user" && <span className="tick">✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}