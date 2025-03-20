import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/CustomNavbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ManageUsers from "./components/ManageUsers";  // Import ManageUsers component
import ManageBooks from "./components/ManageBooks";  // Import ManageBooks component

// A functional component that renders the Router and handles the Navbar visibility logic
function AppContent() {
  const location = useLocation();

  // Check if the current route is "/admin"
  const isAdminPage = location.pathname === "/admin" || location.pathname === "/manage-users" || location.pathname === "/manage-books";

  return (
    <>
      {/* Conditionally render Navbar based on the route */}
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/manage-users" element={<ManageUsers />} />  {/* New Route for ManageUsers */}
        <Route path="/manage-books" element={<ManageBooks />} />  {/* New Route for ManageBooks */}
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
