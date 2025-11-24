import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    dispatch(register(submitData));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="mt-4 register-page">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow border-0 auth-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2>Create Account</h2>
                <p className="text-white-50">Join AI Notes Analyzer</p>
              </div>

              {error && (
                <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    isInvalid={!!validationErrors.username}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    isInvalid={!!validationErrors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      isInvalid={!!validationErrors.password}
                      required
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    isInvalid={!!validationErrors.confirmPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-white-50 mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;