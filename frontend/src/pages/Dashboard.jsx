import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAIStatus } from '../store/slices/dashboardSlice';
import { fetchNotes } from '../store/slices/notesSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error, aiStatus, aiStatusLoading } = useSelector(state => state.dashboard);
  const { notes } = useSelector(state => state.notes);
  // Count pinned notes dynamically from notes array
const pinnedNotesCount = notes.filter(note => note.isPinned).length;


  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(fetchNotes({ limit: 3, sortBy: 'updatedAt', sortOrder: 'desc' }));
    dispatch(getAIStatus());
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
    <Container className="mt-4 dashboard-page">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold">Dashboard</h2>
              <p className="text-muted">Welcome to your AI-powered notes analyzer</p>
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

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {/* AI Service Status Alert */}
      {aiStatus && (
        <Row className="mb-3">
          <Col>
            <Alert 
              variant={
                aiStatus.status === 'operational' ? 'success' :
                aiStatus.status === 'unavailable' ? 'warning' : 'info'
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-robot me-2"></i>
                  <strong>AI Service Status:</strong> {aiStatus.status === 'operational' ? 'Ready' : 'Checking...'}
                  {aiStatus.capabilities && (
                    <small className="ms-2">
                      ({aiStatus.capabilities.length} capabilities available)
                    </small>
                  )}
                </div>
                {aiStatusLoading && (
                  <Spinner animation="border" size="sm" />
                )}
              </div>
            </Alert>
          </Col>
        </Row>
      )}



      {/* Stats Cards */}
<Row className="g-4 mb-5">
  {/* Total Notes */}
  <Col md={3}>
    <Card className="text-center h-100 shadow stats-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className="bi bi-journal-text display-6 text-primary"></i>
        </div>
        <Card.Title>Total Notes</Card.Title>
        <h3 className="text-primary">{stats.totalNotes || 0}</h3>
        <small className="text-white-50">All your notes</small>
      </Card.Body>
    </Card>
  </Col>

  {/* AI Analyzed */}
  <Col md={3}>
    <Card className="text-center h-100 shadow stats-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className="bi bi-robot display-6 text-info"></i>
        </div>
        <Card.Title>AI Analyzed</Card.Title>
        <h3 className="text-info">{stats.analyzedNotes || 0}</h3>
        <small className="text-white-50">With AI insights</small>
      </Card.Body>
    </Card>
  </Col>

  {/* This Week */}
  <Col md={3}>
    <Card className="text-center h-100 shadow stats-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className="bi bi-clock display-6 text-warning"></i>
        </div>
        <Card.Title>This Week</Card.Title>
        <h3 className="text-warning">{stats.recentNotes || 0}</h3>
        <small className="text-white-50">Last 7 days</small>
      </Card.Body>
    </Card>
  </Col>

  {/* Pinned Notes (New Column) */}
  <Col md={3}>
  <Card className="text-center h-100 shadow stats-card">
    <Card.Body className="d-flex flex-column">
      <div className="mb-3">
        <i className="bi bi-pin-angle display-6 text-success"></i>
      </div>
      <Card.Title>Pinned Notes</Card.Title>
      <h3 className="text-success">{pinnedNotesCount}</h3>
      <small className="text-white-50">Important notes</small>
    </Card.Body>
  </Card>
</Col>
</Row>




    <Row className="g-3  mb-5">
  {/* Personal Notes */}
  <Col md={3}>
    <Card className="text-center h-100 shadow stats-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className="bi bi-person display-6 text-primary"></i>
        </div>
        <Card.Title>Personal Notes</Card.Title>
        <h3 className="text-primary">{stats.categoryCount?.Personal || 0}</h3>
        <small className="text-white-50">Personal category</small>
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
              <small className="text-white-50">Study category</small>
            </Card.Body>
          </Card>
        </Col>

  {/* Work Notes */}
  <Col md={3}>
    <Card className="text-center h-100 shadow stats-card">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <i className="bi bi-briefcase display-6 text-warning"></i>
        </div>
        <Card.Title>Work Notes</Card.Title>
        <h3 className="text-warning">{stats.categoryCount?.Work || 0}</h3>
        <small className="text-white-50">Work category</small>
      </Card.Body>
    </Card>
  </Col>
</Row>



      <Row className="g-5">
        {/* Recent Notes */}
        <Col md={6}>
          <Card className="h-100 shadow">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-dark">
                <i className="bi bi-clock-history me-2"></i>
                Recent Notes
              </h5>
            </Card.Header>
            <Card.Body>
              {recentNotes.length > 0 ? (
                recentNotes.map(note => (
                  <div key={note._id} className="border-bottom   py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1 fw-semibold ">{note.title}</h6>
                        <p className="text-white-50 small mb-2">
                          {note.content.substring(0, 80)}...
                        </p>
                        <div>
                          <Badge bg="primary" className="me-1">{note.category}</Badge>
                          <small className="text-white-50">
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
                <div className="text-center text-white-50 py-4">
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
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0 text-dark fw-bold">
                <i className="bi bi-graph-up me-2"></i>
                AI Insights
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
               <strong class="fw-semibold">Most Common Writing Tone:</strong> 
                <Badge bg="info" className="ms-2">{stats.commonTone || 'N/A'}</Badge>
              </div>
              
              <div className="mb-3">
                <strong class="fw-semibold">Top Keywords:</strong>
      
                <div className="mt-2">
                  {stats.topKeywords && stats.topKeywords.length > 0 ? (
                    stats.topKeywords.map(keyword => (
                      <Badge key={keyword} bg="secondary" className="me-1 mb-1">
                        {keyword}
                      </Badge>
                    ))
                  ) : (
                    <small className="text-white-50 ">No keywords analyzed yet</small>
                  )}
                </div>
              </div>
              
              <div className="mb-3">
               
                <strong class="fw-semibold">Notes by Category:</strong>

                <div className="mt-2">
                  {Object.entries(stats.categoryCount || {}).map(([category, count]) => (
                    <div key={category} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                      <span className="d-flex align-items-center">
                        <i className={`bi ${
                          category === 'Study' ? 'bi-book' :
                          category === 'Work' ? 'bi-briefcase' :
                          'bi-person'
                        } me-2 text-white-50 `}></i>
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
                    <div className="text-center text-white-50  py-2">
                      <small>No notes categorized yet</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Stats */}
              <div className="mt-4 pt-3 border-top">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="small text-white-50 ">Analyzed Notes</div>
                    <div className="h5 mb-0 text-white-50">{stats.analyzedNotes || 0}</div>
                  </div>
                  <div className="col-6">
                    <div className="small text-white-50 ">Analysis Rate</div>
                    <div className="h5 mb-0 text-white-50">
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
              <small className="text-info">
                <i className="bi bi-info-circle me-1"></i>
                Insights powered by AI analysis
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Empty State Guidance
      {stats.totalNotes === 0 && (
        <Row className="mt-5">
          <Col>
            <Card className="border-warning">
              <Card.Body className="text-center py-5">
                <i className="bi bi-journal-plus display-1 text-warning mb-3"></i>
                <h3 className="text-warning">Welcome to AI Notes Analyzer!</h3>
                <p className="text-muted mb-4">
                  Get started by creating your first note. Our AI will help you analyze and organize your notes effectively.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Link to="/notes/new" className="btn btn-warning btn-lg">
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Your First Note
                  </Link>
                  <Link to="/notes" className="btn btn-outline-secondary btn-lg">
                    <i className="bi bi-journal-text me-2"></i>
                    View Notes Tutorial
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )} */}
    </Container>
  );
};

export default Dashboard;