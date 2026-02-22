import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Messages.css";

export default function Messages() {
  const { trainerName } = useParams();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]); // Array to hold sent messages

  // --- ADDED ASYNC TO THE FUNCTION ---
  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    // YOUR EXISTING MESSAGE OBJECT
    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: "user", // Identifies this as your message
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };

    // --- NEW DB CODE START ---
    try {
      await fetch('http://localhost:5000/api/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerName: trainerName,
          senderName: "Rona Stacharya", // Current user
          content: inputText // The text from the box
        }),
      });
      // Logic continues to show message on screen after sending to DB
    } catch (error) {
      console.error("Database storage failed:", error);
    }
    // --- NEW DB CODE END ---

    setMessages([...messages, newMessage]);
    setInputText(""); // Clear the input box
  };

  return (
    <div className="messages-page">
      <Navbar />
      <div className="chat-container">
        <div className="chat-header">
          <h2>Conversation with {trainerName.replace("-", " ")}</h2>
        </div>
        
        <div className="chat-window">
          <p className="system-msg">Start your fitness consultation...</p>
          
          {/* Render messages dynamically */}
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-bubble">
                <p>{msg.text}</p>
                <div className="message-info">
                  <span>{msg.time}</span>
                  <span className="tick">✓</span> {/* Single tick for sent */}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}