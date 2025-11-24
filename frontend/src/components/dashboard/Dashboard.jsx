import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../store/slices/dashboardSlice';
import { fetchNotes } from '../store/slices/notesSlice';



const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(state => state.dashboard);
  const { notes } = useSelector(state => state.notes);

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(fetchNotes({ limit: 3, sortBy: 'updatedAt', sortOrder: 'desc' }));
  }, [dispatch]);

  const recentNotes = notes.slice(0, 3);

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" className="text-primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">Dashboard</h2>
              <p className="text-muted">Welcome to your AI-powered notes analyzer</p>
            </div>
            <Link to="/notes/new" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              New Note
            </Link>
          </div>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

     {/* AI Diagnostic Component */}
<Row className="mb-5">
  <Col>
    <AIDiagnostic />
  </Col>
</Row>

      {/* Stats Cards */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="text-center h-100 shadow stats-card">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-journal-text display-6 text-primary"></i>
              </div>
              <Card.Title>Total Notes</Card.Title>
              <h3 className="text-primary">{stats.totalNotes || 0}</h3>
              <small className="text-muted">All your notes</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow stats-card">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-book display-6 text-success"></i>
              </div>
              <Card.Title>Study Notes</Card.Title>
              <h3 className="text-success">{stats.categoryCount?.Study || 0}</h3>
              <small className="text-muted">Study category</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow stats-card">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-robot display-6 text-info"></i>
              </div>
              <Card.Title>AI Analyzed</Card.Title>
              <h3 className="text-info">{stats.analyzedNotes || 0}</h3>
              <small className="text-muted">With AI insights</small>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center h-100 shadow stats-card">
            <Card.Body className="d-flex flex-column">
              <div className="mb-3">
                <i className="bi bi-clock display-6 text-warning"></i>
              </div>
              <Card.Title>Recent Notes</Card.Title>
              <h3 className="text-warning">{stats.recentNotes || 0}</h3>
              <small className="text-muted">Last 7 days</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Recent Notes */}
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-dark ">
              <h5 className="mb-0 text-dark">
                <i className="bi bi-clock-history me-2"></i>
                Recent Notes
              </h5>
            </Card.Header>
            <Card.Body>
              {recentNotes.length > 0 ? (
                recentNotes.map(note => (
                  <div key={note._id} className="border-bottom py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-semibold">
                          <Link to={`/notes/${note._id}`} className="text-decoration-none text-dark">
                            {note.title}
                          </Link>
                        </h6>
                        <p className="text-muted small mb-2">
                          {note.content.substring(0, 80)}...
                        </p>
                        <div>
                          <Badge bg="primary" className="me-1">{note.category}</Badge>
                          <small className="text-muted">
                            Updated {new Date(note.updatedAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      {note.isPinned && (
                        <i className="bi bi-pin-angle-fill text-warning ms-2" title="Pinned"></i>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-4 ">
                  <i className="bi bi-inbox display-4 d-block mb-2"></i>
                  No recent notes
                  <div className="mt-2">
                    <Link to="/notes/new" className="btn btn-sm btn-outline-primary">
                      Create Your First Note
                    </Link>
                  </div>
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
          <Card className="h-100 shadow">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                AI Insights
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Most Common Writing Tone:</strong>
                <Badge bg="info" className="ms-2">{stats.commonTone || 'N/A'}</Badge>
              </div>
              
              <div className="mb-3">
                <strong>Top Keywords:</strong>
                <div className="mt-2">
                  {stats.topKeywords && stats.topKeywords.length > 0 ? (
                    stats.topKeywords.map(keyword => (
                      <Badge key={keyword} bg="secondary" className="me-1 mb-1">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <small className="text-muted">No keywords analyzed yet</small>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
                <strong>Notes by Category:</strong>
                <div className="mt-2">
                  {Object.entries(stats.categoryCount || {}).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                      <span className="d-flex align-items-center">
                        <i className={`bi ${
                          category === 'Study' ? 'bi-book' :
                          category === 'Work' ? 'bi-briefcase' :
                          'bi-person'
                        } me-2 text-muted`}></i>
                        {category}
                      </span>
                      <Badge bg={
                        category === 'Study' ? 'primary' :
                        category === 'Work' ? 'success' :
                        'info'
                      }>
                        {count}
                      </Badge>
                    </div>
                  ))}
                  {(!stats.categoryCount || Object.keys(stats.categoryCount).length === 0) && (
                    <div className="text-center text-muted py-2">
                      <small>No notes categorized yet</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4 pt-3 border-top">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="small text-muted">Analyzed Notes</div>
                    <div className="h5 mb-0">{stats.analyzedNotes || 0}</div>
                  </div>
                  <div className="col-6">
                    <div className="small text-muted">Analysis Rate</div>
                    <div className="h5 mb-0">
                      {stats.totalNotes ? 
                        `${Math.round(((stats.analyzedNotes || 0) / stats.totalNotes) * 100)}%` : 
                        '0%'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent">
              <small className="text-muted">
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