// Header.js
import React from "react";
import { Link } from "react-router-dom";

function Header({ onLogout }) {
  return (
    <div style={{ backgroundColor: '#007BFF', padding: '15px', borderRadius: '5px' }} className="d-flex justify-content-between align-items-center">
      <h4 className="text-white mb-0">Admin Panel</h4>
      <div>
        <Link to="/manage-users" className="btn btn-light me-2">Manage Students</Link>
        <Link to="/manage-books" className="btn btn-light">Manage Books</Link>
        <button onClick={onLogout} className="btn btn-danger ms-3">Logout</button>
      </div>
    </div>
  );
}

export default Header;
