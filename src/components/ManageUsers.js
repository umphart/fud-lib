import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";  // Import the Header component

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedUser, setEditedUser] = useState({ fullName: "", email: "", regNumber: "" });

  const navigate = useNavigate();

  // Fetch students from API
  useEffect(() => {
    fetch("http://localhost:5000/students")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching students:", err));
  }, []);

  const removeUser = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
  };

  const editUser = (index) => {
    setEditingIndex(index);
    setEditedUser(users[index]);
  };

  const saveEditedUser = () => {
    const updatedUsers = [...users];
    updatedUsers[editingIndex] = editedUser;
    setUsers(updatedUsers);
    setEditingIndex(null);
    setEditedUser({ fullName: "", email: "", regNumber: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear authentication token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="container mt-5">
      {/* Use the Header component */}
      <Header onLogout={handleLogout} />

      <h3 className="mt-4 mb-3">Manage Students</h3>

      {/* Registered Students Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Registration Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              {editingIndex === index ? (
                <>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editedUser.fullName}
                      onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      className="form-control"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="form-control"
                      value={editedUser.regNumber}
                      onChange={(e) => setEditedUser({ ...editedUser, regNumber: e.target.value })}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success btn-sm me-2" onClick={saveEditedUser}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditingIndex(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.regNumber}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => editUser(index)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => removeUser(user.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
