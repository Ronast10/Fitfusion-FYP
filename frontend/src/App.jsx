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
import Profile from "./pages/Profile"; // Imported correctly

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
        <Route path="/profile" element={<Profile />} /> {/* ADDED THIS ROUTE */}

        {/* Support & Shopping */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/messages/:trainerName" element={<Messages />} />

        {/* Wildcard redirect - catches broken links and sends to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;