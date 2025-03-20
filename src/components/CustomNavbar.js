import React, { useState, useEffect } from "react";  
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
  Container,
  Button
} from "reactstrap";

function CustomNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current route

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsAuthenticated(token !== null); 
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Hide navbar when on Dashboard page
  if (location.pathname === "/dashboard") {
    return null; // Don't render the navbar on the dashboard page
  }

  return (
    <Navbar color="dark" dark expand="md" className="shadow-lg py-3">
      <Container>
        <NavbarBrand tag={Link} to="/">📚 Federal University Dutse (FUD) Library</NavbarBrand>
        <NavbarToggler onClick={toggleNavbar} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto" navbar>
            
              <>
                <NavItem>
                  <NavLink tag={Link} to="/login" className="text-light">Login</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/register" className="text-light">Register</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/admin" className="text-light">Admin</NavLink>
                </NavItem>
              </>
          
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
