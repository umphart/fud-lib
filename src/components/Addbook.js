import React, { useState } from "react";

function AddBook({ onAdd }) {
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookISBN, setBookISBN] = useState("");

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookISBN.trim()) {
      alert("Book title and ISBN are required!");
      return;
    }

    // Create a new book object
    const newBook = { title: bookTitle, author: bookAuthor, isbn: bookISBN };

    try {
      // Save book to `db.json` using API
      const response = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const addedBook = await response.json();
        onAdd(addedBook); // Update UI with the new book
        setBookTitle("");
        setBookAuthor("");
        setBookISBN("");
        alert("Book added successfully!");
      } else {
        alert("Failed to add book!");
      }
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <form onSubmit={handleAddBook} className="mb-3">
      <h3>Add a New Book</h3>
      <div className="d-flex align-items-center gap-2">
        <input
          type="text"
          placeholder="Book Title"
          className="form-control w-25"
          value={bookTitle}
          onChange={(e) => setBookTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Author (Optional)"
          className="form-control w-25"
          value={bookAuthor}
          onChange={(e) => setBookAuthor(e.target.value)}
        />
        <input
          type="text"
          placeholder="ISBN Number"
          className="form-control w-25"
          value={bookISBN}
          onChange={(e) => setBookISBN(e.target.value)}
          required
        />
        <button type="submit" className="btn btn-success">Add Book</button>
      </div>
    </form>
  );
}

export default AddBook;
