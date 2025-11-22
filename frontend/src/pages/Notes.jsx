import React, { useState } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { searchNotes, deleteNote, analyzeNote } from '../store/slices/notesSlice';
import NoteCard from '../components/notes/NoteCard';
import SearchBar from '../components/search/SearchBar';

const Notes = () => {
  const dispatch = useDispatch();
  const { notes, searchResults, filters } = useSelector(state => state.notes);
  const [selectedCategory, setSelectedCategory] = useState('');

  const displayedNotes = filters.search || selectedCategory ? searchResults : notes;

  const handleSearch = (query) => {
    dispatch(searchNotes({ query, category: selectedCategory }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(searchNotes({ query: filters.search, category }));
  };

  const handleAnalyze = (note) => {
    dispatch(analyzeNote(note._id));
  };

  const handleEdit = (note) => {
    // This will be handled by routing in the real app
    console.log('Edit note:', note);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>My Notes</h2>
              <p className="text-muted">Manage and analyze your notes with AI</p>
            </div>
            

            <Button 
                  as={Link} 
                  to="/notes/new" 
                  variant="success" 
                  size="sm" 
                  className="new-note-btn me-2"
                >
                  <i className="bi bi-plus-lg me-1"></i>
                  New Note
                </Button>

          </div>
        </Col>
      </Row>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={8}>
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col md={4}>
          <Form.Select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Notes Grid */}
      <Row className="g-4">
        {displayedNotes.map(note => (
          <Col key={note._id} lg={4} md={6}>
            <NoteCard 
              note={note} 
              onEdit={handleEdit}
              onAnalyze={handleAnalyze}
            />
          </Col>
        ))}
      </Row>

      {displayedNotes.length === 0 && (
        <Row>
          <Col>
            <div className="text-center py-5">
              <i className="bi bi-journal-x display-1 text-muted"></i>
              <h4 className="mt-3 text-muted">No notes found</h4>
              <p className="text-muted">
                {filters.search || selectedCategory 
                  ? 'Try adjusting your search criteria' 
                  : 'Create your first note to get started'
                }
              </p>
              {!filters.search && !selectedCategory && (
                <Link to="/notes/new" className="btn btn-primary mt-2">
                  Create Your First Note
                </Link>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Notes;