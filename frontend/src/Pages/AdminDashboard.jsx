import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./AdminDashboard.css"; 

export default function AdminDashboard() {
  const [data, setData] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    inventoryValue: 0,
    members: [],
  });
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [file, setFile] = useState(null);
  const [productForm, setProductForm] = useState({ name: "", price: "", category: "" });

  const navigate = useNavigate();
  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
      return;
    }
    fetchDashboardData();
    fetchMessages();
    fetchProducts();
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/dashboard-stats`);
      if (res.data.success) setData(res.data);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/messages`);
      if (res.data.success) setMessages(res.data.messages);
    } catch (err) {
      console.error("Messages Fetch Error:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Shop Fetch Error:", err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!file) return Swal.fire("Error", "Please select an image", "error");
    if (!productForm.category) return Swal.fire("Error", "Please select a category", "error");

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("category", productForm.category);
    formData.append("image", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/products/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (res.data.success) {
        Swal.fire("Success", "Product added successfully!", "success");
        setProductForm({ name: "", price: "", category: "" });
        setFile(null);
        fetchProducts(); 
      }
    } catch (err) {
      Swal.fire("Error", "Upload failed. Check console for details.", "error");
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This will remove it from the shop.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      confirmButtonText: "Yes, delete",
      background: "#1a1a1a",
      color: "#fff"
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  const deleteMember = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This member will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4757",
      confirmButtonText: "Yes, delete!",
      background: "#1a1a1a",
      color: "#fff",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`);
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

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Management Hub</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </header>

      {/* Statistics Cards */}
      <section className="stats-container">
        <div className="stat-card">
          <h4>Total Members</h4>
          <h2 className="blue-text">{data.totalUsers}</h2>
        </div>
        <div className="stat-card">
          <h4>Membership Revenue</h4>
          <h2 className="green-text">Rs. {data.totalRevenue}</h2>
        </div>
        <div className="stat-card">
          <h4>Inventory Value</h4>
          <h2 className="yellow-text">Rs. {data.inventoryValue}</h2>
        </div>
      </section>

      {/* SHOP MANAGEMENT SECTION */}
      <section className="admin-section">
        <h3>Shop Management</h3>
        <form onSubmit={handleAddProduct} className="admin-product-form-inline">
          <div className="form-group">
            <input 
              type="text" placeholder="Name" 
              value={productForm.name} 
              onChange={(e) => setProductForm({...productForm, name: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <input 
              type="number" placeholder="Price" 
              value={productForm.price} 
              onChange={(e) => setProductForm({...productForm, price: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <select 
              value={productForm.category} 
              onChange={(e) => setProductForm({...productForm, category: e.target.value})} 
              required
            >
              <option value="">Category</option>
              <option value="Whey Protein">Whey Protein</option>
              <option value="Creatine">Creatine</option>
              <option value="Mass Gainer">Mass Gainer</option>
              <option value="Gym Clothing">Gym Clothing</option>
              <option value="Best Seller">Best Seller</option>
            </select>
          </div>
          <div className="form-group">
            <input type="file" id="file-upload" onChange={(e) => setFile(e.target.files[0])} required />
          </div>
          <button type="submit" className="add-item-btn">Add Item</button>
        </form>

        <div className="admin-product-grid">
          {products.map(p => (
            <div key={p._id} className="admin-product-item">
              <img src={`${API_BASE_URL}${p.image}`} alt={p.name} />
              <p className="p-name">{p.name}</p>
              <p className="p-cat">[{p.category}]</p>
              <button onClick={() => deleteProduct(p._id)} className="admin-remove-btn">Remove</button>
            </div>
          ))}
        </div>
      </section>

      {/* Member Directory */}
      <section className="admin-section">
        <h3>Member Directory</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: "center" }}>Loading members...</td></tr>
            ) : data.members.map((user) => {
              const status = user.membershipData?.membershipStatus || "Free Member";
              const lowerStatus = status.toLowerCase();
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="status-text" style={{ color: lowerStatus.includes("pro") ? "#2ed573" : lowerStatus.includes("elite") ? "#eccc68" : "#ff4757" }}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => deleteMember(user._id)} className="remove-btn">Remove</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Message Center / Trainer Chat Entry */}
      <section className="admin-section">
        <div className="section-header-inline">
          <h3>Trainer Inquiries</h3>
          {/* NEW: Primary button to enter the two-way chat interface */}
          <button 
            className="chat-entry-btn" 
            onClick={() => navigate("/admin/chat")}
          >
            💬 Open Chat Interface
          </button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sender Name</th>
              <th>Trainer Assigned</th>
              <th>Message Content</th>
              <th>Date Sent</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: "center" }}>No messages found.</td></tr>
            ) : messages.map((msg) => (
              <tr key={msg._id}>
                <td>{msg.senderName}</td>
                <td className="blue-text">{msg.trainerName}</td>
                <td className="msg-content">{msg.content}</td>
                <td className="date-text">{new Date(msg.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}