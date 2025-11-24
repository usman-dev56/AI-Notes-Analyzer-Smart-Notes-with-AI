import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createNote, updateNote, fetchNote, clearError } from '../store/slices/notesSlice';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentNote, loading, error } = useSelector(state => state.notes);
  
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Study',
    tags: '',
    isPinned: false
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchNote(id));
    }
  }, [dispatch, isEditing, id]);

  useEffect(() => {
    if (currentNote && isEditing) {
      setFormData({
        title: currentNote.title,
        content: currentNote.content,
        category: currentNote.category,
        tags: currentNote.tags?.join(', ') || '',
        isPinned: currentNote.isPinned || false
      });
    }
  }, [currentNote, isEditing]);

  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setShowAlert(true);
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    
    const noteData = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPinned: formData.isPinned
    };

    try {
      if (isEditing) {
        await dispatch(updateNote({ id, ...noteData })).unwrap();
        setAlertMessage('Note updated successfully!');
      } else {
        await dispatch(createNote(noteData)).unwrap();
        setAlertMessage('Note created successfully!');
      }
      
      setShowAlert(true);
      setTimeout(() => {
        navigate('/notes');
      }, 1500);
    } catch (error) {
      // Error is handled by Redux and will be displayed
      console.error('Error saving note:', error);
    }
  };

  // const handleAnalyze = () => {
  //   // Will be implemented when we add AI
  //   alert('AI Analysis feature will be available soon!');
  // };

   // In the NoteEditor component, update the handleAnalyze function:
const handleAnalyze = async () => {
  if (!currentNote.content || currentNote.content.trim().length < 20) {
    setAlertMessage('Note content is too short for AI analysis (minimum 20 characters required)');
    setShowAlert(true);
    return;
  }

  try {
    await dispatch(analyzeNote(currentNote._id)).unwrap();
    setAlertMessage('✅ AI analysis completed successfully! Check the AI Analysis panel below.');
    setShowAlert(true);
    
    // Refresh the note data to show updated AI analysis
    dispatch(fetchNote(currentNote._id));
  } catch (error) {
    setAlertMessage(`❌ AI analysis failed: ${error}`);
    setShowAlert(true);
  }
};
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && isEditing) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading note...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 note-editor-page">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h4 className="mb-0 text-dark">
                <i className={`bi bi-${isEditing ? 'pencil' : 'plus'}-circle me-2`}></i>
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h4>
            </Card.Header>
            
            <Card.Body>
              {showAlert && (
                <Alert 
                  variant={error ? "danger" : "success"} 
                  dismissible 
                  onClose={() => setShowAlert(false)}
                >
                  <i className={`bi bi-${error ? 'exclamation-triangle' : 'check-circle'}-fill me-2`}></i>
                  {alertMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter note title..."
                        required
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="Study">Study</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Write your note content here..."
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="ai, machine learning, study notes"
                        disabled={loading}
                      />
                      <Form.Text className="text-white-50">
                        Separate tags with commas
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="isPinned"
                        label="Pin this note"
                        checked={formData.isPinned}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button 
                    type="submit" 
                    variant="primary"
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
                        {isEditing ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <i className={`bi bi-${isEditing ? 'check' : 'plus'}-circle me-2`}></i>
                        {isEditing ? 'Update Note' : 'Create Note'}
                      </>
                    )}
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      type="button" 
                      variant="outline-info" 
                      onClick={handleAnalyze}
                      disabled={loading}
                    >
                      <i className="bi bi-robot me-2"></i>
                      AI Analyze
                    </Button>
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline-secondary text-warning" 
                    onClick={() => navigate('/notes')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* AI Analysis Preview */}
          {currentNote?.aiAnalysis && (
            <Card className="mt-4 shadow">
              <Card.Header className="bg-light">
                <h5 className="mb-0 text-dark">
                  <i className="bi bi-robot me-2"></i>
                  AI Analysis
                </h5>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="summary" className="mb-3">
                  <Tab eventKey="summary" title="Summary">
                    <p>{currentNote.aiAnalysis.summary}</p>
                  </Tab>
                  <Tab eventKey="keywords" title="Keywords">
                    <div>
                      {currentNote.aiAnalysis.keywords?.map((keyword, index) => (
                        <span key={index} className="badge bg-primary me-1 mb-1">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </Tab>
                  <Tab eventKey="questions" title="Study Questions">
                    <ol>
                      {currentNote.aiAnalysis.questions?.map((question, index) => (
                        <li key={index} className="mb-2">{question}</li>
                      ))}
                    </ol>
                  </Tab>
                  <Tab eventKey="simplified" title="Simplified Version">
                    <p>{currentNote.aiAnalysis.simplifiedContent}</p>
                  </Tab>
                  <Tab eventKey="tone" title="Writing Tone">
                    <div className="d-flex align-items-center">
                      <strong>Tone:</strong>
                      <span className={`badge ms-2 ${
                        currentNote.aiAnalysis.tone === 'formal' ? 'bg-primary' :
                        currentNote.aiAnalysis.tone === 'academic' ? 'bg-success' :
                        'bg-info'
                      }`}>
                        {currentNote.aiAnalysis.tone}
                      </span>
                    </div>
                    <small className="text-light mt-2 d-block">
                      Last analyzed: {new Date(currentNote.aiAnalysis.lastAnalyzed).toLocaleString()}
                    </small>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NoteEditor;