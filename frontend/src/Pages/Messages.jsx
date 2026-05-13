import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./Messages.css";

export default function Messages() {
  const { trainerName } = useParams(); // e.g., "sarah-tamang"
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);

  // Data from your profile
  const userId = "ronastacharya@gmail.com"; 
  const userName = "Ronast Acharya";
  const API_BASE = "http://localhost:5000/api/messages";

  // 1. Load History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE}/history/${trainerName}/${userId}`);
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Could not load history. Ensure trainerName in URL matches DB.", err);
      }
    };
    fetchHistory();
  }, [trainerName, userId]);

  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

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
        setMessages([...messages, res.data.message]);
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
          {messages.map((msg) => (
            <div key={msg._id || Math.random()} className={`message-wrapper ${msg.senderRole}`}>
              <div className="message-bubble">
                <p>{msg.content}</p>
                <div className="message-info">
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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