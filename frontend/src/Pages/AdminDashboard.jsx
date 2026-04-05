import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; 

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    inventoryValue: 0,
    members: [],
  });
  
  // NEW STATE: For storing user messages
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
      return;
    }
    fetchDashboardData();
    fetchMessages(); // Fetch messages on load
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats");
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  // NEW FUNCTION: Fetch inquiries from the backend
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/message");
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const deleteMember = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      cancelButtonColor: "#2f3542",
      confirmButtonText: "Yes, delete!",
      background: "#1a1a1a",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`http://localhost:5000/api/admin/user/${id}`);
        if (res.data.success) {
          Swal.fire({ title: "Deleted!", icon: "success", background: "#1a1a1a", color: "#fff" });
          fetchDashboardData();
        }
      } catch (err) {
        Swal.fire("Error", "Could not remove member", "error");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  // UI Styles
  const cardStyle = { background: "#1a1a1a", padding: "20px", borderRadius: "12px", flex: 1, margin: "10px", border: "1px solid #333" };
  const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px", background: "#111", borderRadius: "8px", overflow: "hidden" };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "40px", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Admin Management Hub</h1>
        <button onClick={logout} style={{ background: "#ff4757", color: "#fff", border: "none", padding: "12px 25px", cursor: "pointer", borderRadius: "8px", fontWeight: "600" }}>
          Logout
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h4 style={{ color: "#aaa", marginBottom: "10px" }}>Total Members</h4>
          <h2 style={{ color: "#3498db", fontSize: "2rem" }}>{data.totalUsers}</h2>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: "#aaa", marginBottom: "10px" }}>Membership Revenue</h4>
          <h2 style={{ color: "#2ed573", fontSize: "2rem" }}>Rs. {data.totalRevenue}</h2>
        </div>
        <div style={cardStyle}>
          <h4 style={{ color: "#aaa", marginBottom: "10px" }}>Inventory Value</h4>
          <h2 style={{ color: "#eccc68", fontSize: "2rem" }}>Rs. {data.inventoryValue}</h2>
        </div>
      </div>

      {/* Member Directory */}
      <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333", marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "20px" }}>Member Directory</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ textAlign: "left", background: "#222", color: "#aaa" }}>
              <th style={{ padding: "15px" }}>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>Loading members...</td></tr>
            ) : data.members.map((user) => {
              const status = user.membershipStatus || "Free Member";
              const lowerStatus = status.toLowerCase();
              return (
                <tr key={user._id} style={{ borderBottom: "1px solid #222" }}>
                  <td style={{ padding: "15px" }}>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      color: lowerStatus.includes("pro") ? "#2ed573" : lowerStatus.includes("elite") ? "#eccc68" : "#ff4757",
                      fontWeight: "600"
                    }}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => deleteMember(user._id)} style={{ background: "rgba(255, 71, 87, 0.1)", border: "1px solid #ff4757", color: "#ff4757", cursor: "pointer", padding: "6px 12px", borderRadius: "4px" }}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* NEW: MESSAGE CENTER SECTION */}
      <div style={{ background: "#1a1a1a", padding: "30px", borderRadius: "12px", border: "1px solid #333" }}>
        <h3 style={{ marginBottom: "20px" }}>Trainer Inquiries</h3>
        <table style={tableStyle}>
          <thead>
            <tr style={{ textAlign: "left", background: "#222", color: "#aaa" }}>
              <th style={{ padding: "15px" }}>Sender Name</th>
              <th>Trainer Assigned</th>
              <th>Message Content</th>
              <th>Date Sent</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: "20px", textAlign: "center" }}>No messages found.</td></tr>
            ) : messages.map((msg) => (
              <tr key={msg._id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: "15px" }}>{msg.senderName}</td>
                <td style={{ color: "#3498db" }}>{msg.trainerName}</td>
                <td style={{ maxWidth: "450px", padding: "12px 0", lineHeight: "1.4" }}>
                  {msg.content}
                </td>
                <td style={{ fontSize: "0.85rem", color: "#777" }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}