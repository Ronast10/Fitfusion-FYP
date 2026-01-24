import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact"; // 1. Import the new Contact page

function App() {
  return (
    <>
      <Routes>
        {/* 2. Change root to Landing so users see the home page first */}
        <Route path="/" element={<Landing />} /> 
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 3. Add the Contact Us route */}
        <Route path="/contact" element={<Contact />} />

        {/* Optional: Fallback to redirect unknown URLs back to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;