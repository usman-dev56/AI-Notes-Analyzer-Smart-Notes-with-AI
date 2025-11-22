import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { createNote, updateNote, analyzeNote } from '../store/slices/notesSlice';

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notes } = useSelector(state => state.notes);
  
  const isEditing = !!id;
  const currentNote = isEditing ? notes.find(note => note._id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Study',
    tags: '',
    isPinned: false
  });

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (currentNote) {
      setFormData({
        title: currentNote.title,
        content: currentNote.content,
        category: currentNote.category,
        tags: currentNote.tags?.join(', ') || '',
        isPinned: currentNote.isPinned || false
      });
    }
  }, [currentNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const noteData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    if (isEditing) {
      dispatch(updateNote({ id, ...noteData }));
    } else {
      dispatch(createNote(noteData));
    }

    setShowAlert(true);
    setTimeout(() => {
      navigate('/notes');
    }, 1000);
  };

  const handleAnalyze = () => {
    if (currentNote) {
      dispatch(analyzeNote(currentNote._id));
      setShowAlert(true);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow">
            <Card.Header className="bg-light ">
              <h4 className="mb-0 text-dark">
                <i className={`bi bi-${isEditing ? 'pencil' : 'plus'}-circle me-2`}></i>
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h4>
            </Card.Header>
            
            <Card.Body>
              {showAlert && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {isEditing ? 'Note updated successfully!' : 'Note created successfully!'}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="Enter note title..."
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
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
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your note content here... (Markdown supported)"
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags (comma separated)</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="ai, machine learning, study notes"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Pin this note"
                        checked={formData.isPinned}
                        onChange={(e) => setFormData({...formData, isPinned: e.target.checked})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2">
                  <Button type="submit" variant="primary">
                    <i className={`bi bi-${isEditing ? 'check' : 'plus'}-circle me-2`}></i>
                    {isEditing ? 'Update Note' : 'Create Note'}
                  </Button>
                  
                  {isEditing && (
                    <Button type="button" variant="outline-info" onClick={handleAnalyze}>
                      <i className="bi bi-robot me-2"></i>
                      AI Analyze
                    </Button>
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline-secondary" 
                    onClick={() => navigate('/notes')}
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
                  <i className="bi bi-robot  me-2"></i>
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
                    <small className="text-muted mt-2 d-block">
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