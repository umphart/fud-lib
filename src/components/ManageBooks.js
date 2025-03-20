import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddBook from "./Addbook";
import Header from "./Header";  // Import the Header component

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedBook, setEditedBook] = useState({ title: "", author: "", isbn: "" });

  const navigate = useNavigate();

  // Fetch books from API
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch("http://localhost:5000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("Error fetching books:", err));
  };

  const removeBook = async (id) => {
    try {
      await fetch(`http://localhost:5000/books/${id}`, { method: "DELETE" });
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const editBook = (index) => {
    setEditingIndex(index);
    setEditedBook(books[index]);
  };

  const saveEditedBook = async () => {
    try {
      await fetch(`http://localhost:5000/books/${books[editingIndex].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedBook),
      });

      const updatedBooks = [...books];
      updatedBooks[editingIndex] = editedBook;
      setBooks(updatedBooks);
      setEditingIndex(null);
      setEditedBook({ title: "", author: "", isbn: "" });
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear authentication token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="container mt-5">
      {/* Use the Header component */}
      <Header onLogout={handleLogout} />

      <AddBook onAdd={fetchBooks} />

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title or author"
          className="form-control w-50 mx-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3 className="mb-4">Book List</h3>
      
      {/* Books Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books
            .filter((book) =>
              book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((book, index) => (
              <tr key={book.id}>
                {editingIndex === index ? (
                  <>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editedBook.title}
                        onChange={(e) => setEditedBook({ ...editedBook, title: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editedBook.author}
                        onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        value={editedBook.isbn}
                        onChange={(e) => setEditedBook({ ...editedBook, isbn: e.target.value })}
                      />
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm me-2" onClick={saveEditedBook}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditingIndex(null)}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.isbn}</td>
                    <td>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => editBook(index)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => removeBook(book.id)}>Delete</button>
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

export default ManageBooks;
