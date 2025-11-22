import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../store/slices/dashboardSlice';

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
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Container>
        );
    }

    const recentNotes = notes.slice(0, 3);

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

            {/* Stats Cards */}
            <Row className="g-4 mb-5">
                <Col md={3}>
                    <Card className="text-center h-100 shadow stats-card">
                        <Card.Body className="d-flex flex-column">
                            <div className="mb-3">
                                <i className="bi bi-journal-text display-6 text-primary"></i>
                            </div>
                            <Card.Title>Total Notes</Card.Title>
                            <h3 className="text-primary">{stats?.totalNotes || notes.length}</h3>
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
                            <h3 className="text-success">{stats?.categoryCount?.Study || notes.filter(n => n.category === 'Study').length}</h3>
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
                            <h3 className="text-info">{stats?.analyzedNotes || notes.filter(n => n.aiAnalysis).length}</h3>
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
                            <h3 className="text-warning">{stats?.recentNotes || recentNotes.length}</h3>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4">
                {/* Recent Notes */}
                <Col md={6}>
                    <Card className="h-100 shadow">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">
                                <i className="bi bi-clock-history me-2"></i>
                                Recent Notes
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            {recentNotes.map(note => (
                                <div key={note._id} className="border-bottom py-3">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                    {/* // In the recent notes section, update the note title to be clickable */}
                                            <h6 className="mb-1 fw-semibold">
                                                <Link
                                                    to={`/notes/${note._id}`}
                                                    className="text-decoration-none text-dark"
                                                >
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
                                            <i className="bi bi-pin-angle-fill text-warning ms-2"></i>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {recentNotes.length === 0 && (
                                <div className="text-center text-muted py-4">
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
                    <Card className="h-100 shadow">
                        <Card.Header className="bg-light ">
                            <h5 className="mb-0 ">
                                <i className="bi bi-graph-up me-2 "></i>
                                AI Insights
                            </h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>Most Common Writing Tone:</strong>
                                <Badge bg="info" className="ms-2">{stats?.commonTone || 'academic'}</Badge>
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
                                    {Object.entries({
                                        Study: notes.filter(n => n.category === 'Study').length,
                                        Work: notes.filter(n => n.category === 'Work').length,
                                        Personal: notes.filter(n => n.category === 'Personal').length
                                    }).map(([category, count]) => (
                                        <div key={category} className="d-flex justify-content-between align-items-center py-1 border-bottom">
                                            <span>{category}</span>
                                            <Badge bg="outline-primary">{count}</Badge>
                                        </div>
                                    ))}
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

            {/* Quick Actions */}
            <Row className="mt-5">
                <Col>
                    <Card className="shadow">
                        <Card.Header className="bg-light">
                            <h5 className="mb-0">Quick Actions</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row className="g-3">
                                <Col md={3}>
                                    <Link to="/notes/new" className="btn btn-outline-primary w-100 h-100 py-3">
                                        <i className="bi bi-plus-circle d-block mb-2 fs-2"></i>
                                        Create Note
                                    </Link>
                                </Col>
                                <Col md={3}>
                                    <Link to="/notes" className="btn btn-outline-success w-100 h-100 py-3">
                                        <i className="bi bi-search d-block mb-2 fs-2"></i>
                                        Browse Notes
                                    </Link>
                                </Col>
                                <Col md={3}>
                                    <Button variant="outline-info" className="w-100 h-100 py-3" disabled>
                                        <i className="bi bi-robot d-block mb-2 fs-2"></i>
                                        AI Analysis
                                    </Button>
                                </Col>
                                <Col md={3}>
                                    <Button variant="outline-warning" className="w-100 h-100 py-3" disabled>
                                        <i className="bi bi-download d-block mb-2 fs-2"></i>
                                        Export Notes
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;