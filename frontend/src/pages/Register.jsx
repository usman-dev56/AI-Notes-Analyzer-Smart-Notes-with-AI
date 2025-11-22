import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Mock registration - in real app, this would be an API call
      const mockUser = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.username)}&background=007bff&color=fff`
      };

      // Dispatch login action (simulating successful registration)
      dispatch(login(mockUser));
      
      // Show success message and redirect
      navigate('/dashboard', { 
        replace: true,
        state: { message: 'Registration successful! Welcome to AI Notes Analyzer.' }
      });
      
    } catch (err) {
      console.error('Registration error:', err);
      // Error is handled by Redux in real implementation
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', variant: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const strengths = [
      { label: 'Very Weak', variant: 'danger' },
      { label: 'Weak', variant: 'danger' },
      { label: 'Fair', variant: 'warning' },
      { label: 'Good', variant: 'info' },
      { label: 'Strong', variant: 'success' }
    ];

    return strengths[Math.min(strength, 4)];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '60px', height: '60px' }}>
                  <i className="bi bi-journal-text text-white fs-4"></i>
                </div>
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">Join AI Notes Analyzer and boost your productivity</p>
              </div>

              {/* Demo Alert */}
              <Alert variant="info" className="mb-4">
                <div className="d-flex">
                  <i className="bi bi-info-circle me-2"></i>
                  <div>
                    <strong>Demo Version</strong> - This is a static demo. Registration will simulate success and log you in with mock data.
                  </div>
                </div>
              </Alert>

              {/* Error Alert */}
              {error && (
                <Alert variant="danger" dismissible onClose={() => {}}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Username */}
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
                  <Form.Text className="text-muted">
                    This will be your public display name.
                  </Form.Text>
                </Form.Group>

                {/* Email */}
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

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      isInvalid={!!validationErrors.password}
                      required
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={togglePasswordVisibility}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  
                  {/* Password Strength Meter */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Password strength:</small>
                        <small className={`text-${passwordStrength.variant} fw-bold`}>
                          {passwordStrength.label}
                        </small>
                      </div>
                      <div className="progress" style={{ height: '4px' }}>
                        <div 
                          className={`progress-bar bg-${passwordStrength.variant}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </Form.Group>

                {/* Confirm Password */}
                <Form.Group className="mb-3">
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

                {/* Terms Agreement */}
                <Form.Group className="mb-4">
                  <div className="d-flex align-items-start">
                    <Form.Check
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      isInvalid={!!validationErrors.agreeToTerms}
                      className="mt-1 me-2"
                    />
                    <Form.Label className="flex-grow-1 mb-0">
                      I agree to the{' '}
                      <a href="#terms" onClick={(e) => e.preventDefault()}>
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()}>
                        Privacy Policy
                      </a>
                    </Form.Label>
                  </div>
                  {validationErrors.agreeToTerms && (
                    <div className="text-danger small mt-1">
                      {validationErrors.agreeToTerms}
                    </div>
                  )}
                </Form.Group>

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted">
                      Or
                    </span>
                  </div>
                </div>

                {/* Social Login */}
                <div className="d-grid gap-2 mb-4">
                  <Button variant="outline-dark" size="lg" disabled>
                    <i className="bi bi-google me-2"></i>
                    Sign up with Google
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary text-decoration-none fw-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Features Section */}
          <Row className="mt-4 text-center">
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-robot text-primary fs-4 me-2"></i>
                <div className="text-start">
                  <small className="fw-semibold d-block">AI Powered</small>
                  <small className="text-muted">Smart analysis</small>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-search text-primary fs-4 me-2"></i>
                <div className="text-start">
                  <small className="fw-semibold d-block">Smart Search</small>
                  <small className="text-muted">Find notes fast</small>
                </div>
              </div>
            </Col>
            <Col md={4} className="mb-3">
              <div className="d-flex align-items-center justify-content-center">
                <i className="bi bi-shield-check text-primary fs-4 me-2"></i>
                <div className="text-start">
                  <small className="fw-semibold d-block">Secure</small>
                  <small className="text-muted">Your data is safe</small>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;