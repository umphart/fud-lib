import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function AdminPanel() {
  const [requests, setRequests] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(""); // Track username input
  const [password, setPassword] = useState(""); // Track password input
  const [loginError, setLoginError] = useState(""); // Track login error message
  const navigate = useNavigate(); // Use useNavigate instead of useHistory
  // Default username and password for admin login
  const defaultUsername = "admin";
  const defaultPassword = "1234";

  // Check if user is authenticated by looking for auth token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true); // If auth token exists, mark as logged in
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return; // Don't fetch data if not logged in

    fetch("http://localhost:5000/borrowRequests")
      .then((res) => res.json())
      .then((data) => setRequests(data));

    fetch("http://localhost:5000/borrowedBooks")
      .then((res) => res.json())
      .then((data) => setBorrowedBooks(data));
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (username === defaultUsername && password === defaultPassword) {
      // Store auth token in localStorage
      localStorage.setItem("authToken", "admin-auth-token");
      setIsLoggedIn(true); // Mark user as logged in
      setLoginError(""); // Clear any previous error
    } else {
      setLoginError("Invalid credentials. Please try again.");
    }
  };

 
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear authentication token
    setIsLoggedIn(false); // Set login state to false
    navigate("/"); // Redirect to login page using navigate
  };
  const approveRequest = async (request) => {
    const studentAlreadyBorrowed = borrowedBooks.find(
      (book) => book.studentName === request.studentName
    );

    if (studentAlreadyBorrowed) {
      alert(`${request.studentName} already has a borrowed book.`);
      return;
    }

    await fetch("http://localhost:5000/borrowedBooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...request,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      }),
    });

    await fetch(`http://localhost:5000/borrowRequests/${request.id}`, { method: "DELETE" });

    setRequests(requests.filter((req) => req.id !== request.id));
    setBorrowedBooks([...borrowedBooks, request]);

    alert(`Approved: ${request.studentName} borrowed "${request.title}"`);
  };

  const sendReturnReminder = async (book) => {
    const reminderNotification = {
      studentId: book.studentId,
      title: "Return Book Reminder",
      message: `Dear ${book.studentName}, please return the book "${book.title}" which is due on ${book.dueDate}.`,
      status: "Unread",
    };

    await fetch("http://localhost:5000/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reminderNotification),
    });

    setNotifications([...notifications, reminderNotification]);

    alert(`Reminder sent to ${book.studentName} for returning the book "${book.title}".`);
  };

  // If not logged in, show the login form
  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <h3 className="text-center">Admin Login</h3>
        
        {/* Center the form */}
        <div className="d-flex justify-content-center">
          <div className="w-50"> {/* Adjust this class to change the width of inputs */}
            <div className="form-group mt-4">
              <label>Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loginError && <div className="text-danger mt-2">{loginError}</div>}
            <button onClick={handleLogin} className="btn btn-primary mt-4 w-100">Login</button> {/* Full-width button */}
          </div>
        </div>
      </div>
    );
  }
  

  return (
    <div className="container mt-5">
      {/* Header Section with Manage Users, Manage Books Links, and Logout Button */}
      <div style={{ backgroundColor: '#007BFF', padding: '15px', borderRadius: '5px' }} className="d-flex justify-content-between align-items-center">
        <h4 className="text-white mb-0">Admin Panel</h4>
        <div>
          <Link to="/manage-users" className="btn btn-light me-2">Manage Students</Link>
          <Link to="/manage-books" className="btn btn-light">Manage Books</Link>
          {/* Logout button */}
          <button onClick={handleLogout} className="btn btn-danger ms-3">Logout</button>
        </div>
      </div>

      <h4 className="mt-4">Pending Borrow Requests</h4>
      {requests.length > 0 ? (
        <ul className="list-group">
          {requests.map((req) => (
            <li key={req.id} className="list-group-item">
              <strong>{req.title}</strong> - {req.studentName}
              <button className="btn btn-success btn-sm float-end" onClick={() => approveRequest(req)}>
                Approve
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending requests.</p>
      )}


      <h4 className="mt-4">Currently Borrowed Books</h4>
      {borrowedBooks.length > 0 ? (
        <ul className="list-group">
          {borrowedBooks.map((book) => (
            <li key={book.id} className="list-group-item">
              <strong>{book.title}</strong> borrowed by {book.studentName} (Due: {book.dueDate})
              <button
                className="btn btn-warning btn-sm float-end ms-2"
                onClick={() => sendReturnReminder(book)} // Send reminder button
              >
                Send Reminder
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books currently borrowed.</p>
      )}
      
      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; {new Date().getFullYear()} Library System. All Rights Reserved.</p>
        <p>Developed by Your Company Name</p>
      </footer>
    </div>
  );
}

export default AdminPanel;
