import React, { useEffect, useState } from "react";  
import axios from "axios";
import { Card, CardBody, CardTitle, CardText, Button, Container } from "reactstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Home() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate(); // Create navigate function

  useEffect(() => {
    axios.get("http://localhost:5000/books")
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  // Function to handle button click and navigate to login page
  const handleGetStartedClick = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <Container className="mt-5">
        {/* Welcome Card */}
        <Card className="shadow-lg p-4 mb-4 text-center bg-light">
          <CardBody>
            <CardTitle tag="h4">📚 Welcome to Federal University Dutse Library</CardTitle>
            <CardText>
              Explore a vast collection of books and manage your library experience effortlessly.
            </CardText>
            <Button color="primary" onClick={handleGetStartedClick}>Get Started</Button>
          </CardBody>
        </Card>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-5">
        <p>&copy; {new Date().getFullYear()} Library System. All Rights Reserved.</p>
        <p>Developed by Your Company Name</p>
      </footer>
    </div>
  );
}

export default Home;
