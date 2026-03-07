import { Routes, Route, Navigate } from "react-router-dom";
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

// 1. IMPORT YOUR NEW ADMIN PAGES
import AdminLogin from "./pages/AdminLogin"; 
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<Landing />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} /> 
        <Route path="/membership" element={<Membership />} />
        
        {/* User Account Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Support & Shopping */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/messages/:trainerName" element={<Messages />} />

        {/* 2. ADD ADMIN ROUTES HERE */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* 3. ALWAYS KEEP WILDCARD AT THE VERY BOTTOM */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;