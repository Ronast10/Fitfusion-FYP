import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: "", price: "", category: "Protein", image: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/products/add", formData);
    fetchProducts(); // Refresh list
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ background: "#000", color: "#fff", padding: "50px" }}>
      <h1>Admin Shop Management</h1>
      <form onSubmit={handleAdd} style={{ marginBottom: "50px" }}>
        <input type="text" placeholder="Name" onChange={(e)=>setFormData({...formData, name:e.target.value})} />
        <input type="number" placeholder="Price" onChange={(e)=>setFormData({...formData, price:e.target.value})} />
        <input type="text" placeholder="Image URL" onChange={(e)=>setFormData({...formData, image:e.target.value})} />
        <button type="submit" style={{background: "#ff4757", color: "#fff"}}>Add Product</button>
      </form>

      <h2>Current Products</h2>
      {products.map(p => (
        <div key={p._id} style={{ borderBottom: "1px solid #333", padding: "10px", display: "flex", justifyContent: "space-between" }}>
          <span>{p.name} - Rs. {p.price}</span>
          <button onClick={() => handleDelete(p._id)} style={{ color: "red" }}>Delete</button>
        </div>
      ))}
    </div>
  );
}