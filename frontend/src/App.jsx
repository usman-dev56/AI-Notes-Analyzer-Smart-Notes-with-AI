import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/Dashboard';
import Notes from './pages/Notes';
import NoteDetails from './pages/NoteDetails'; // Add this import
import NoteEditor from './pages/NoteEditor';
import Login from './pages/Login';
import Register from './pages/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
// import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <Container fluid className="main-container">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/new" element={<NoteEditor />} />
              <Route path="/notes/edit/:id" element={<NoteEditor />} />
              <Route path="/notes/:id" element={<NoteDetails />} /> {/* Add this route */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </Provider>
  );
}

export default App;