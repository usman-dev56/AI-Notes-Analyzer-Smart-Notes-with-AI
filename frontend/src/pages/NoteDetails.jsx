import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNote, deleteNote, togglePin, clearError } from '../store/slices/notesSlice';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentNote, loading, error } = useSelector(state => state.notes);

  useEffect(() => {
    if (id) {
      dispatch(fetchNote(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id))
        .unwrap()
        .then(() => {
          navigate('/notes');
        })
        .catch(error => {
          console.error('Delete failed:', error);
        });
    }
  };

  const handleTogglePin = () => {
    dispatch(togglePin(id));
  };

  // const handleAnalyze = () => {
  //   // Will be implemented when we add AI
  //   alert('AI Analysis feature will be available soon!');
  // };

  // In the NoteDetails component, update the handleAnalyze function:
const handleAnalyze = async () => {
  if (!currentNote.content || currentNote.content.trim().length < 20) {
    alert('Note content is too short for AI analysis (minimum 20 characters required)');
    return;
  }

  try {
    await dispatch(analyzeNote(currentNote._id)).unwrap();
    alert('✅ AI analysis completed successfully! Check the AI Analysis panel.');
  } catch (error) {
    alert(`❌ AI analysis failed: ${error}`);
  }
};

  const handleEdit = () => {
    navigate(`/notes/edit/${id}`);
  };

  if (loading) {
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <h4>Error Loading Note</h4>
          <p>{error}</p>

          <Link to="/notes" className="btn btn-primary">
            Back to Notes
          </Link>

        </Alert>
      </Container>
    );
  }

  if (!currentNote) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <h4>Note Not Found</h4>
          <p>The note you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link to="/notes" className="btn btn-primary">
            Back to Notes
          </Link>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 note-details-page">
      {/* Header with Actions */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center mb-2">
             
                <h2 className="mb-0">{currentNote.title}</h2>
                {currentNote.isPinned && (
                  <i className="bi bi-pin-angle-fill text-warning ms-2 fs-5" title="Pinned"></i>
                )}
              </div>
      
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Badge bg="primary">{currentNote.category}</Badge>
                <small className="text-muted">
                  Created: {new Date(currentNote.createdAt).toLocaleDateString()}
                </small>
                <small className="text-muted">
                  Updated: {new Date(currentNote.updatedAt).toLocaleDateString()}
                </small>
              </div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-2">
              <Button variant="outline-primary" 
                  size="sm" 
                  className="btn btn-soft btn-soft-primary"
                   onClick={handleEdit}>
                <i className="bi bi-pencil me-2"></i>
                Edit
              </Button>
              <Button 
                variant={currentNote.isPinned ? "warning" : "outline-warning"}
                onClick={handleTogglePin}
              >
                <i className={`bi bi-pin-angle${currentNote.isPinned ? '-fill' : ''} me-2 `}></i>
                {currentNote.isPinned ? 'Unpin' : 'Pin'}
              </Button>
              {/* <Button variant="outline-primary" className="btn btn-soft btn-soft-info" onClick={handleAnalyze}>
                <i className="bi bi-robot me-2"></i>
                AI Analyze
              </Button> */}
              <Button  variant="outline-primary" className="btn btn-soft btn-soft-danger" onClick={handleDelete}>
                <i className="bi bi-trash me-2"></i>
                Delete
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Main Content */}
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-light text-dark">
              <h5 className="mb-0">
                <i className="bi bi-journal-text me-2"></i>
                Note Content
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="note-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {currentNote.content}
              </div>
              
              {/* Tags */}
              {currentNote.tags && currentNote.tags.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <strong>Tags: </strong>
                  {currentNote.tags.map(tag => (
                    <Badge key={tag} bg="primary"  className="me-1 mb-1">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>








        {/* AI Analysis Sidebar */}
        <Col lg={4}>
          <Card className="shadow">
            <Card.Header className="bg-light text-dark">
              <h5 className="mb-0">
                <i className="bi bi-robot me-2"></i>
                AI Analysis
              </h5>
            </Card.Header>

            <Card.Body>
              {currentNote.aiAnalysis ? (
                <Tabs defaultActiveKey="summary" className="mb-3">
                  <Tab eventKey="summary" title="Summary">
                    <div className="p-2">
                      <p className="mb-0">{currentNote.aiAnalysis.summary}</p>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="keywords" title="Keywords">
                    <div className="p-2">
                      {currentNote.aiAnalysis.keywords?.map((keyword, index) => (
                        <Badge key={index} bg="primary" className="me-1 mb-1">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </Tab>
                  
                  <Tab eventKey="questions" title="Questions">
                    <div className="p-2">
                      <ol className="ps-3">
                        {currentNote.aiAnalysis.questions?.map((question, index) => (
                          <li key={index} className="mb-2 small">
                            {question}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="simplified" title="Simplified">
                    <div className="p-2">
                      <p className="mb-0 small">{currentNote.aiAnalysis.simplifiedContent}</p>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="tone" title="Tone">
                    <div className="p-2">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Tone: </strong>
                        <Badge 
                          bg={
                            currentNote.aiAnalysis.tone === 'formal' ? 'primary' :
                            currentNote.aiAnalysis.tone === 'academic' ? 'success' :
                            'info'
                          } 
                          className="ms-2"
                        >
                          {currentNote.aiAnalysis.tone}
                        </Badge>
                      </div>
                      <small className="text-light">
                        Last analyzed: {new Date(currentNote.aiAnalysis.lastAnalyzed).toLocaleString()}
                      </small>
                    </div>
                  </Tab>
                </Tabs>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-robot display-4 text-muted d-block mb-2"></i>
                  <p className="text-muted mb-3">No AI analysis available</p>
                  <Button variant="outline-primary" onClick={handleAnalyze}>
                    Analyze with AI
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow mt-4">
            <Card.Header className="bg-light text-dark">
              <h6 className="mb-0">Note Statistics</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span>Characters:</span>
                  <strong>{currentNote.content.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Words:</span>
                  <strong>{currentNote.content.split(/\s+/).filter(word => word.length > 0).length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Category:</span>
                  <Badge bg="primary">{currentNote.category}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Status:</span>
                  <Badge bg={currentNote.isPinned ? "warning" : "secondary"}>
                    {currentNote.isPinned ? "Pinned" : "Normal"}
                  </Badge>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NoteDetails;