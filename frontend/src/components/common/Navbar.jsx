
import React from 'react';
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

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <Navbar expand="lg" fixed="top" className="custom-navbar" variant="dark">
      <Container fluid className="navbar-container">
        {/* Brand Logo - Left */}
        <Navbar.Brand  className="brand-logo">
          <div className="logo-icon">
            <i className="bi bi-journal-bookmark-fill"></i>
          </div>
          <div className="brand-text">
            <span className="brand-main">AI Notes</span>
          </div>
        </Navbar.Brand>

        {/* Mobile Toggle */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle" />

        <Navbar.Collapse id="basic-navbar-nav">
          {isAuthenticated ? (
            <>
              {/* Navigation Links - Center */}
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
              </Nav>

              {/* User Dropdown - Right */}
              <Nav className="ms-auto">
                <Dropdown align="end" className="nav-dropdown">
                  <Dropdown.Toggle variant="outline-light" size="sm" className="user-toggle">
                    <div className="user-avatar">
                      <img 
                        src={user?.avatar || '/default-avatar.png'} 
                        alt={user?.username}
                        className="avatar-img"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <span className="user-name">{user?.username}</span>
                    <i className="bi bi-chevron-down ms-1 small"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="nav-dropdown-menu">
                    <Dropdown.Header className="dropdown-header">
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-2">
                          <img 
                            src={user?.avatar || '/default-avatar.png'} 
                            alt={user?.username}
                            className="avatar-img"
                          />
                        </div>
                        <div>
                          <div className="fw-bold small text-white">{user?.username}</div>
                          <small className="text-primary" style={{ fontSize: '0.8rem', textTransform: 'none' }}>{user?.email}</small>
                        </div>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Divider className="dropdown-divider" />
                    <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item">
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/profile" className="dropdown-item">
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings" className="dropdown-item">
                      <i className="bi bi-gear me-2"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider className="dropdown-divider" />
                    <Dropdown.Item onClick={handleLogout} className="dropdown-item logout-item">
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </>
          ) : (
            /* Login/Signup - Right */
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/login" className="nav-item">
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