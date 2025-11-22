import React from 'react';
import { Card, Badge, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote } from '../../store/slices/notesSlice';

const NoteCard = ({ note, onAnalyze }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(note._id));
    }
  };

  return (
    <Card className="h-100 shadow-sm note-card">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Card.Title className="h5 mb-1 flex-grow-1">{note.title}</Card.Title>
          {note.isPinned && (
            <i className="bi bi-pin-angle-fill text-warning ms-2"></i>
          )}
        </div>
        
        <div className="mb-2">
          <Badge bg="primary" className="me-1">{note.category}</Badge>
          {note.tags?.map(tag => (
            <Badge bg="outline-secondary" className="me-1 text-dark" key={tag}>
              #{tag}
            </Badge>
          ))}
        </div>

        <Card.Text className="text-muted small flex-grow-1">
          {note.content.substring(0, 120)}...
        </Card.Text>

        {note.aiAnalysis && (
          <div className="mt-2 p-2 bg-light rounded small">
            <strong className="d-block mb-1">AI Insights:</strong>
            <div className="text-muted">
              <div><strong>Summary:</strong> {note.aiAnalysis.summary?.substring(0, 80)}...</div>
              <div className="mt-1">
                <strong>Tone:</strong> <Badge bg="info" className="ms-1">{note.aiAnalysis.tone}</Badge>
              </div>
            </div>
          </div>
        )}
      </Card.Body>

      <Card.Footer className="bg-transparent">
        <Row className="g-2">
          <Col>
            <small className="text-muted">
              Updated {new Date(note.updatedAt).toLocaleDateString()}
            </small>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-1">
              {/* Read More Button */}
              <Link 
                to={`/notes/${note._id}`}
                className="btn btn-outline-success btn-sm"
                title="View Full Note"
              >
                <i className="bi bi-eye"></i>
              </Link>
              
              <Link 
                to={`/notes/edit/${note._id}`}
                className="btn btn-outline-primary btn-sm"
                title="Edit Note"
              >
                <i className="bi bi-pencil"></i>
              </Link>
              
              <Button 
                variant="outline-info btn-sm" 
                onClick={() => onAnalyze(note)}
                title="AI Analyze"
              >
                <i className="bi bi-robot"></i>
              </Button>
              
              <Button 
                variant="outline-danger btn-sm" 
                onClick={handleDelete}
                title="Delete Note"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default NoteCard;