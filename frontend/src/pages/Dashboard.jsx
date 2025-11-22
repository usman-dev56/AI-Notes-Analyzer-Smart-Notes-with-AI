import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../store/slices/dashboardSlice';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector(state => state.dashboard);
  const { notes } = useSelector(state => state.notes);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>Dashboard</h2>
          <p className="text-muted">Welcome to your AI-powered notes analyzer</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-journal-text display-6 text-primary"></i>
              </div>
              <Card.Title>Total Notes</Card.Title>
              <h3 className="text-primary">{stats?.totalNotes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-book display-6 text-success"></i>
              </div>
              <Card.Title>Study Notes</Card.Title>
              <h3 className="text-success">{stats?.categoryCount?.Study || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-robot display-6 text-info"></i>
              </div>
              <Card.Title>AI Analyzed</Card.Title>
              <h3 className="text-info">{stats?.analyzedNotes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-clock display-6 text-warning"></i>
              </div>
              <Card.Title>This Week</Card.Title>
              <h3 className="text-warning">{stats?.recentNotes || 0}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Recent Notes */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-dark fw-bold">
                <i className="bi bi-clock-history me-2"></i>
                Recent Notes
              </h5>
            </Card.Header>
            <Card.Body>
              {stats?.recentNotesList?.map(note => (
                <div key={note._id} className="border-bottom py-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{note.title}</h6>
                      <p className="text-white-50 small mb-2">
                        {note.content.substring(0, 80)}...
                      </p>
                      <div>
                        <Badge bg="primary" className="me-1">{note.category}</Badge>
                        <small className="text-white-50">
                          {new Date(note.updatedAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    {note.isPinned && (
                      <i className="bi bi-pin-angle-fill text-warning"></i>
                    )}
                  </div>
                </div>
              ))}
              {(!stats?.recentNotesList || stats.recentNotesList.length === 0) && (
                <div className="text-center text-white-50 py-4">
                  <i className="bi bi-inbox display-4 d-block mb-2"></i>
                  No recent notes
                </div>
              )}
            </Card.Body>
            <Card.Footer className="bg-transparent">
              <Link to="/notes" className="btn btn-outline-primary btn-sm">
                View All Notes
              </Link>
            </Card.Footer>
          </Card>
        </Col>
        
        {/* AI Insights */}
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-dark fw-bold">
                <i className="bi bi-graph-up me-2"></i>
                AI Insights
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Most Common Writing Tone:</strong>
                <Badge bg="info" className="ms-2">{stats?.commonTone || 'N/A'}</Badge>
              </div>
              
              <div className="mb-3">
                <strong>Top Keywords:</strong>
                <div className="mt-2">
                  {stats?.topKeywords?.map(keyword => (
                    <Badge key={keyword} bg="secondary" className="me-1 mb-1">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Notes by Category:</strong>
                <div className="mt-2">
                  {Object.entries(stats?.categoryCount || {}).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between py-1">
                      <span>{category}</span>
                      <Badge bg="outline-primary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent">
              <small className="text-white-50">
                <i className="bi bi-info-circle me-1"></i>
                Insights powered by AI analysis
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;