import { Routes, Route } from "react-router-dom";
import Login from "../src/pages/Login.jsx";
import Signup from "../src/pages/Signup.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";

export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    
  )
}
