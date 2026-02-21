import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Contact from "./pages/Contact"; 
import Shop from "./pages/Shop";
import Messages from "./pages/Messages";
import About from "./pages/About";
import Tips from "./pages/Tips"; // This was missing in your screenshot!

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/tips" element={<Tips />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/messages/:trainerName" element={<Messages />} />

        {/* Wildcard redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;