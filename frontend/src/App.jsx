import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import { getMe } from './store/slices/authSlice';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails';
import NoteEditor from './pages/NoteEditor';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(state => state.auth);
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppContent = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  return (
    <Router>
      <div className="App">
  
          <Navbar />
          <div className="main-container">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" replace />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/notes" element={
                <ProtectedRoute>
                  <Notes />
                </ProtectedRoute>
              } />
              <Route path="/notes/new" element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } />
              <Route path="/notes/edit/:id" element={
                <ProtectedRoute>
                  <NoteEditor />
                </ProtectedRoute>
              } />
              <Route path="/notes/:id" element={
                <ProtectedRoute>
                  <NoteDetails />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          
        </div>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;