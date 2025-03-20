import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [borrowedBook, setBorrowedBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) navigate("/login");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));

    fetch(`http://localhost:5000/borrowedBooks?studentId=${storedUser?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setBorrowedBook(data[0]);
      });

    // Fetch notifications
    fetch(`http://localhost:5000/notifications?studentId=${storedUser?.id}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, [navigate]);

  const requestBook = async (book) => {
    if (borrowedBook) {
      alert(`You must return "${borrowedBook.title}" before borrowing another.`);
      return;
    }

    const request = {
      studentId: user.id,
      studentName: user.fullName,
      email: user.email,
      regNumber: user.regNumber,
      title: book.title,
      isbn: book.isbn,
      status: "Pending",
    };

    await fetch("http://localhost:5000/borrowRequests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    alert("Your request has been sent for admin approval.");
  };

  const returnBook = async () => {
    if (!borrowedBook) {
      alert("You have no book to return.");
      return;
    }

    await fetch(`http://localhost:5000/borrowedBooks/${borrowedBook.id}`, {
      method: "DELETE",
    });

    setBorrowedBook(null);
    alert(`You have successfully returned "${borrowedBook.title}".`);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileModalClose = () => setShowProfileModal(false);
  const handleProfileModalShow = () => setShowProfileModal(true);

  const handleNotificationsModalClose = () => setShowNotificationsModal(false);
  const handleNotificationsModalShow = () => setShowNotificationsModal(true);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.setItem("isAuthenticated", false);
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Library Dashboard</a>
          <div className="d-flex">
            <button className="btn btn-light me-2" onClick={handleProfileModalShow}>
              Profile
            </button>
            <button className="btn btn-light me-2" onClick={handleNotificationsModalShow}>
              Notifications
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="p-4 shadow bg-light rounded">
          <h2 className="text-center mb-3">Student Dashboard</h2>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search books by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {borrowedBook && (
            <div className="alert alert-warning">
              <strong>Borrowed Book:</strong> {borrowedBook.title}
              <button className="btn btn-danger btn-sm float-end" onClick={returnBook}>Return Book</button>
            </div>
          )}

          <h4>Available Books</h4>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => requestBook(book)}>
                        Request to Borrow
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      <Modal show={showProfileModal} onHide={handleProfileModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Student Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {user && (
            <div>
              <h5>Student Details</h5>
              <ul>
                <li><strong>Name:</strong> {user.fullName}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Registration Number:</strong> {user.regNumber}</li>
                <li><strong>Faculty:</strong> {user.session}</li>
                <li><strong>Department:</strong> {user.department}</li>
                <li><strong>Level:</strong> {user.level}</li>
                <li><strong>Session:</strong> {user.session}</li>
                <li><strong>Phone Number:</strong> {user.phoneNumber}</li>
              </ul>

              <h5>Borrowed Books History</h5>
              {borrowedBook ? (
                <ul>
                  <li><strong>Title:</strong> {borrowedBook.title}</li>
                  <li><strong>Author:</strong> {borrowedBook.author}</li>
                  <li><strong>ISBN:</strong> {borrowedBook.isbn}</li>
                </ul>
              ) : (
                <p>No books borrowed yet.</p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleProfileModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Notifications Modal */}
      <Modal show={showNotificationsModal} onHide={handleNotificationsModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Notifications</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map((notification, index) => (
                <li key={index}>
                  <strong>{notification.title}</strong>: {notification.message}
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications yet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleNotificationsModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; {new Date().getFullYear()} Library System. All Rights Reserved.</p>
        <p>Developed by Your Company Name</p>
      </footer>
    </div>
  );
}

export default Dashboard;
