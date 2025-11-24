import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Card, Alert, Spinner, Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';


import { 
  fetchNotes, 
  deleteNote, 
  searchNotes, 
  clearError,
  analyzeNote,
  getAIStatus 
} from '../store/slices/notesSlice';
import NoteCard from '../components/notes/NoteCard';
import SearchBar from '../components/search/SearchBar';

const Notes = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();



  
  const { 
    notes, 
    searchResults, 
    filters, 
    loading, 
    error, 
    pagination,
    aiLoading,
    aiStatus,
    analyzingNoteId
  } = useSelector(state => state.notes);
  
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [showAIToast, setShowAIToast] = useState(false);
  const [aiToastMessage, setAiToastMessage] = useState('');

  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (filters.search) params.search = filters.search;
    
    dispatch(fetchNotes(params));
    
    // Check AI status when component loads
    dispatch(getAIStatus());
  }, [dispatch, selectedCategory, filters.search]);

  useEffect(() => {
    // Sync URL with filters
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (filters.search) params.search = filters.search;
    
    setSearchParams(params);
  }, [selectedCategory, filters.search, setSearchParams]);

  const handleSearch = (query) => {
    dispatch(searchNotes({ query, category: selectedCategory }));
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    dispatch(searchNotes({ query: filters.search, category }));
  };

  const handleAnalyze = async (note) => {
    if (!note.content || note.content.trim().length < 20) {
      setAiToastMessage('Note content is too short for AI analysis (minimum 20 characters required)');
      setShowAIToast(true);
      return;
    }

    try {
      const result = await dispatch(analyzeNote(note._id)).unwrap();
      setAiToastMessage('✅ AI analysis completed successfully!');
      setShowAIToast(true);
    } catch (error) {
      setAiToastMessage(`❌ AI analysis failed: ${error}`);
      setShowAIToast(true);
    }
  };

  const handleDelete = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(noteId));
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    dispatch(searchNotes({ query: '', category: '' }));
    setSearchParams({});
  };

  const displayedNotes = filters.search || selectedCategory ? searchResults : notes;

  return (
    <Container className="mt-4 notes-page">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">My Notes</h2>
              <p className="text-muted">Manage and analyze your notes with AI</p>
            </div>
            {/* <Link to="/notes/new" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Note
            </Link> */}
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

      {/* AI Status Indicator */}
      {aiStatus && (
        <Alert 
          variant={
            aiStatus.status === 'operational' ? 'success' :
            aiStatus.status === 'unavailable' ? 'warning' : 'info'
          } 
          className="mb-3"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className={`bi bi-robot me-2`}></i>
              <strong>AI Service:</strong> {aiStatus.status === 'operational' ? 'Ready' : 'Checking...'}
              {aiStatus.status === 'unavailable' && (
                <small className="ms-2">(Analysis features temporarily disabled)</small>
              )}
            </div>
            {aiLoading && (
              <Spinner animation="border" size="sm" />
            )}
          </div>
        </Alert>
      )}

      {error && (
        <Alert variant="danger" dismissible onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      {/* AI Analysis Toast */}
      <Toast 
        show={showAIToast} 
        onClose={() => setShowAIToast(false)}
        delay={5000}
        autohide
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          zIndex: 1050,
        }}
      >
        <Toast.Header>
          <i className="bi bi-robot me-2"></i>
          <strong className="me-auto">AI Analysis</strong>
        </Toast.Header>
        <Toast.Body>{aiToastMessage}</Toast.Body>
      </Toast>

      {/* Search and Filters */}
      <Row className="mb-4">
        <Col md={8}>
          <SearchBar onSearch={handleSearch} />
        </Col>
        <Col md={4}>
          <div className="d-flex gap-2">
            <Form.Select 
              value={selectedCategory} 
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Study">Study</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
            </Form.Select>
            {(filters.search || selectedCategory) && (
              <Button variant="outline-secondary" onClick={clearFilters}>
                <i className="bi bi-x-circle"></i>
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {/* Results Info */}
      {(filters.search || selectedCategory) && (
        <Row className="mb-3">
          <Col>
            <div className="alert alert-info py-2">
              <small>
                Showing {displayedNotes.length} of {pagination.totalNotes} notes
                {filters.search && ` for "${filters.search}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </small>
            </div>
          </Col>
        </Row>
      )}

      {/* Loading State */}
      {loading && (
        <Row>
          <Col className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Col>
        </Row>
      )}

      {/* Notes Grid */}
      {!loading && (
        <Row className="g-4">
          {displayedNotes.map(note => (
            <Col key={note._id} lg={4} md={6}>
              <NoteCard 
                note={note} 
                onAnalyze={handleAnalyze}
                onDelete={handleDelete}
                aiLoading={aiLoading}
                aiStatus={aiStatus}
              />
            </Col>
          ))}
        </Row>
      )}

      {!loading && displayedNotes.length === 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="text-center py-5">
              <Card.Body>
                <i className="bi bi-journal-x display-1 text-muted"></i>
                <h4 className="mt-3 text-white-50">No notes found</h4>
                <p className="text-white-50">
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
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Notes;