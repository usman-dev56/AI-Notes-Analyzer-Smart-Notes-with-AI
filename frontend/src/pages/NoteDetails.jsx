import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Tabs, Tab, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { analyzeNote, deleteNote } from '../store/slices/notesSlice';

const NoteDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { notes } = useSelector(state => state.notes);

  const note = notes.find(note => note._id === id);

  if (!note) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <h4>Note Not Found</h4>
          <p>The note you're looking for doesn't exist.</p>
          <Link to="/notes" className="btn btn-primary">
            Back to Notes
          </Link>
        </Alert>
      </Container>
    );
  }

  const handleAnalyze = () => {
    dispatch(analyzeNote(note._id));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(note._id));
      navigate('/notes');
    }
  };

  const handleEdit = () => {
    navigate(`/notes/edit/${note._id}`);
  };

  return (
    <Container className="mt-4">
      {/* Header with Actions */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center mb-2">

                {/* <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => navigate('/notes')}
                  className="me-2"
                >
                  <i className="bi bi-arrow-left"></i> Back
                </Button> */}

                <h2 className="mb-0">{note.title}</h2>
                {note.isPinned && (
                  <i className="bi bi-pin-angle-fill text-warning ms-2 fs-5" title="Pinned"></i>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="primary">{note.category}</Badge>
                <small className="text-muted">
                  Created: {new Date(note.createdAt).toLocaleDateString()}
                </small>
                <small className="text-muted">
                  Updated: {new Date(note.updatedAt).toLocaleDateString()}
                </small>
              </div>
            </div>


<div className="d-flex gap-2">
  <button className="btn btn-soft btn-soft-primary">
    <i className="bi bi-pencil me-2"></i> Edit
  </button>

  <button className="btn btn-soft btn-soft-info">
    <i className="bi bi-robot me-2"></i> AI Analyze
  </button>

  <button className="btn btn-soft btn-soft-danger">
    <i className="bi bi-trash me-2"></i> Delete
  </button>
</div>






          </div>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Main Content */}
        <Col lg={8}>
          <Card className="shadow">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-dark">
                <i className="bi bi-journal-text  text-dark me-2"></i>
                Note Content
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="note-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {note.content}
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <strong>Tags: </strong>
                  {note.tags.map(tag => (
                    <Badge key={tag} bg="primary" className="me-1 text-dark">
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
                <i className="bi bi-robot text-dark me-2"></i>
                AI Analysis
              </h5>
            </Card.Header>
            <Card.Body>
              {note.aiAnalysis ? (
                <Tabs defaultActiveKey="summary" className="mb-3">
                  <Tab eventKey="summary" title="Summary">
                    <div className="p-2">
                      <p className="mb-0">{note.aiAnalysis.summary}</p>
                    </div>
                  </Tab>

                  <Tab eventKey="keywords" title="Keywords">
                    <div className="p-2">
                      {note.aiAnalysis.keywords?.map((keyword, index) => (
                        <Badge key={index} bg="primary" className="me-1 mb-1">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </Tab>

                  <Tab eventKey="questions" title="Questions">
                    <div className="p-2">
                      <ol className="ps-3">
                        {note.aiAnalysis.questions?.map((question, index) => (
                          <li key={index} className="mb-2 small">
                            {question}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </Tab>

                  <Tab eventKey="simplified" title="Simplified">
                    <div className="p-2">
                      <p className="mb-0 small">{note.aiAnalysis.simplifiedContent}</p>
                    </div>
                  </Tab>

                  <Tab eventKey="tone" title="Tone">
                    <div className="p-2">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Tone: </strong>
                        <Badge
                          bg={
                            note.aiAnalysis.tone === 'formal' ? 'primary' :
                              note.aiAnalysis.tone === 'academic' ? 'success' :
                                'info'
                          }
                          className="ms-2"
                        >
                          {note.aiAnalysis.tone}
                        </Badge>
                      </div>
                      <small className="text-muted bg-light">
                        Last analyzed: {new Date(note.aiAnalysis.lastAnalyzed).toLocaleString()}
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
            <Card.Header className="bg-light">
              <h6 className="mb-0 text-dark">Note Statistics</h6>
            </Card.Header>
            <Card.Body>
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span>Characters:</span>
                  <strong>{note.content.length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Words:</span>
                  <strong>{note.content.split(/\s+/).filter(word => word.length > 0).length}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Category:</span>
                  <Badge bg="primary">{note.category}</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Status:</span>
                  <Badge bg={note.isPinned ? "warning" : "secondary"}>
                    {note.isPinned ? "Pinned" : "Normal"}
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