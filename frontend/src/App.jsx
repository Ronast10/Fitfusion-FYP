import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

// --- USER PAGES ---
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact"; 
import Shop from "./pages/Shop";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Tips from "./pages/Tips"; 
import Membership from "./pages/Membership";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminChatHub from "./pages/AdminChatHub";


// --- COMPONENTS ---
import Cart from "./components/Cart";
import TrainerChatSection from "./components/TrainerChatSection";

// --- ADMIN PAGES ---
import AdminLogin from "./pages/AdminLogin"; 
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* Public Marketing & User Pages */}
        <Route path="/" element={<Landing />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Shop & Membership */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Messaging System */}
        <Route path="/messages/:trainerName" element={<Messages />} />

        {/* Admin Management Suite */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* NEW Admin Hub Routes */}
        <Route path="/admin/chat" element={<AdminChatHub />} />
        <Route path="/admin/chat-hub" element={<AdminChatHub />} />

        {/* Wildcard: Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;