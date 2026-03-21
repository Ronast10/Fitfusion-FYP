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
import PaymentSuccess from "./pages/PaymentSuccess";
import Cart from "./components/Cart";
// ADMIN PAGES
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
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* User Account Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Support & Shopping */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/messages/:trainerName" element={<Messages />} />

        
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/cart" element={<Cart />} />
        

        {/* 3. ALWAYS KEEP WILDCARD AT THE VERY BOTTOM */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;