import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [identifier, setIdentifier] = useState(""); // Email or Reg Number
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Fetch student records from db.json
      const response = await fetch("http://localhost:5000/students");
      const students = await response.json();

      // Check if user exists
      const user = students.find(
        (student) =>
          (student.email === identifier || student.regNumber === identifier) &&
          student.password === password
      );

      if (user) {
        // Store user details in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(user));

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError("Invalid email/registration number or password!");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="p-4 shadow-lg bg-light rounded w-50">
        <h2 className="text-center mb-3">Student Login</h2>

        {error && <p className="text-danger text-center">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email or Registration Number"
            className="form-control mb-3 w-100"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3 w-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
