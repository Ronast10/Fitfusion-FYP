// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Landing from "./Pages/Landing";
import Dashboard from "./Pages/Dashboard";
import "./App.css";

function App() {
  return (
    /* We use a wrapper that doesn't restrict height or width */
    <div className="app-main-wrapper">
      <Routes>
        {/* Redirect root to Login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* The scrollable Landing page with FitFusion info */}
        <Route path="/landing" element={<Landing />} />

        {/* Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Catch-all: Redirect back to login if route doesn't exist */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;