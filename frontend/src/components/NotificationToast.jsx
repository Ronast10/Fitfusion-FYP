import React, { useEffect } from "react";
import { Bell, ShoppingBag, Award, MessageSquare, X } from "lucide-react";
import "./NotificationToast.css";

export default function NotificationToast({ notification, onClose }) {
  useEffect(() => {
    // Automatically dismiss the side popup after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Choose appropriate icons based on notification types
  const getIcon = () => {
    switch (notification.type) {
      case "membership":
        return <Award className="toast-icon text-gold" />;
      case "purchase":
        return <ShoppingBag className="toast-icon text-green" />;
      case "chat":
        return <MessageSquare className="toast-icon text-blue" />;
      default:
        return <Bell className="toast-icon" />;
    }
  };

  return (
    <div className="notification-toast-card">
      <div className="toast-content-wrapper">
        {getIcon()}
        <div className="toast-text-details">
          <h5>{notification.senderName}</h5>
          <p>{notification.messagePreview}</p>
        </div>
      </div>
      <button onClick={onClose} className="toast-close-btn">
        <X size={16} />
      </button>
    </div>
  );
}