import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Dropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const CustomNavbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { notes } = useSelector(state => state.notes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Count notes by category for the dropdown
  const studyNotes = notes.filter(note => note.category === 'Study').length;
  const workNotes = notes.filter(note => note.category === 'Work').length;
  const personalNotes = notes.filter(note => note.category === 'Personal').length;

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar 
      expand="lg" 
      fixed="top"
      className={`custom-navbar ${isScrolled ? 'scrolled' : ''}`}
      variant="dark"
    >
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand  className="brand-logo">
          <div className="logo-icon">
            <i className="bi bi-journal-bookmark-fill"></i>
          </div>
          <div className="brand-text">
            <span className="brand-main">AI Notes Analyzer</span>
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav">
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              {/* Main Navigation - More Compact */}
              <Nav className="mx-auto">
                <Nav.Link 
                  as={Link} 
                  to="/dashboard" 
                  className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
                >
                  <i className="bi bi-speedometer2 me-1"></i>
                  Dashboard
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/notes" 
                  className={`nav-item ${isActiveRoute('/notes') ? 'active' : ''}`}
                >
                  <i className="bi bi-journal-text me-1"></i>
                  Notes
                  <Badge bg="light" text="dark" className="ms-1 notes-badge">
                    {notes.length}
                  </Badge>
                </Nav.Link>

                <Dropdown as={Nav.Item} className="nav-dropdown">
                  <Dropdown.Toggle as={Nav.Link} className="nav-item">
                    <i className="bi bi-collection me-1"></i>
                    Categories
                  </Dropdown.Toggle>
                  
                  <Dropdown.Menu className="nav-dropdown-menu">
                    <Dropdown.Header>Browse by Category</Dropdown.Header>
                    <Dropdown.Item as={Link} to="/notes?category=Study" className="dropdown-item">
                      <i className="bi bi-book me-2 text-primary"></i>
                      Study
                      <Badge bg="outline-primary" className="ms-2">{studyNotes}</Badge>
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/notes?category=Work" className="dropdown-item">
                      <i className="bi bi-briefcase me-2 text-success"></i>
                      Work
                      <Badge bg="outline-success" className="ms-2">{workNotes}</Badge>
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/notes?category=Personal" className="dropdown-item">
                      <i className="bi bi-person me-2 text-info"></i>
                      Personal
                      <Badge bg="outline-info" className="ms-2">{personalNotes}</Badge>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>

              {/* User Section - More Compact */}
              <Nav className="ms-auto user-nav">
                
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle as={Button} variant="outline-light" size="sm" className="user-toggle">
                    <div className="user-avatar">
                      <img 
                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=666&color=fff`} 
                        alt={user?.username}
                        className="avatar-img"
                      />
                    </div>
                    <span className="user-name">{user?.username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Header>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-2">
                          <img 
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}&background=666&color=fff`} 
                            alt={user?.username}
                            className="avatar-img"
                          />
                        </div>
                        <div>
                          <div className="fw-bold small">{user?.username}</div>
                          <small className="text-muted">{user?.email}</small>
                        </div>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item text-danger">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            /* Guest Navigation - More Compact */
            <Nav className="ms-auto">
              <Nav.Link 
                as={Link} 
                to="/login" 
                className="nav-item"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i>
                Login
              </Nav.Link>
              <Button 
                as={Link} 
                to="/register" 
                variant="outline-light" 
                size="sm"
                className="register-btn"
              >
                <i className="bi bi-person-plus me-1"></i>
                Sign Up
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;