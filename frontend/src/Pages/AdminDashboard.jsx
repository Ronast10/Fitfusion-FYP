import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isAdmin") !== "true") {
      navigate("/admin-login");
      return;
    }
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
    const total = res.data.reduce((acc, p) => acc + Number(p.price), 0);
    setEarnings(total);
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", padding: "50px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Admin Shop Management</h1>
        <button onClick={logout} style={{ background: "#ff4757", color: "#fff", border: "none", padding: "10px" }}>Logout</button>
      </div>
      <div style={{ background: "#1a1a1a", padding: "20px", margin: "20px 0" }}>
        <h3>Total Inventory Value: <span style={{ color: "#2ed573" }}>Rs. {earnings}</span></h3>
      </div>
      {/* Add Product forms and mapping logic here */}
    </div>
  );
}