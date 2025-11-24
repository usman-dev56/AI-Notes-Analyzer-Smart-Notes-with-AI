import React, { useEffect, useState } from 'react';
import { Card, Alert, Button, Spinner, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getAIStatus } from '../store/slices/dashboardSlice';
import { analyzeText } from '../store/slices/notesSlice';
import api from '../services/api';

const AIDiagnostic = () => {
  const dispatch = useDispatch();
  const { aiStatus, aiStatusLoading } = useSelector(state => state.dashboard);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);
  const [directTest, setDirectTest] = useState(null);

  useEffect(() => {
    dispatch(getAIStatus());
  }, [dispatch]);

  const runAITest = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      // Test 1: Direct API call to AI status
      console.log(' Testing AI status endpoint...');
      const statusResponse = await api.get('/ai/status');
      console.log(' AI Status response:', statusResponse.data);

      // Test 2: Test AI analysis with simple text
      console.log(' Testing AI analysis...');
      const testText = "Machine learning is a subset of artificial intelligence that enables computers to learn without being explicitly programmed.";
      const analysisResult = await dispatch(analyzeText(testText)).unwrap();
      console.log(' AI Analysis response:', analysisResult);

      setTestResult({
        success: true,
        message: 'AI service is working correctly!',
        status: statusResponse.data,
        analysis: analysisResult
      });
    } catch (error) {
      console.error(' AI Test failed:', error);
      setTestResult({
        success: false,
        message: error.response?.data?.error || error.message,
        details: error
      });
    } finally {
      setTesting(false);
    }
  };

  const testDirectConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ai/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setDirectTest({ success: true, data });
    } catch (error) {
      setDirectTest({ success: false, error: error.message });
    }
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <h5 className="mb-0"> AI Service Diagnostic</h5>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <strong>Current AI Status:</strong>
          <Badge 
            bg={
              aiStatus?.status === 'operational' ? 'success' :
              aiStatus?.status === 'unavailable' ? 'danger' : 'warning'
            } 
            className="ms-2"
          >
            {aiStatus?.status || 'unknown'}
          </Badge>
          {aiStatusLoading && <Spinner animation="border" size="sm" className="ms-2" />}
        </div>

        {aiStatus?.error && (
          <Alert variant="danger">
            <strong>Error:</strong> {aiStatus.error}
          </Alert>
        )}

        <div className="d-flex gap-2 mb-3">
          <Button 
            onClick={runAITest} 
            disabled={testing}
            variant="outline-primary"
          >
            {testing ? <Spinner animation="border" size="sm" /> : 'Run AI Test'}
          </Button>
          <Button 
            onClick={testDirectConnection}
            variant="outline-secondary"
          >
            Test Direct Connection
          </Button>
          <Button 
            onClick={() => dispatch(getAIStatus())}
            variant="outline-info"
          >
            Refresh Status
          </Button>
        </div>

        {testResult && (
          <Alert variant={testResult.success ? 'success' : 'danger'}>
            <strong>{testResult.success ? 'Test Passed' : ' Test Failed'}:</strong> {testResult.message}
            {testResult.details && (
              <pre className="mt-2 small">{JSON.stringify(testResult.details, null, 2)}</pre>
            )}
          </Alert>
        )}

        {directTest && (
          <Alert variant={directTest.success ? 'success' : 'warning'}>
            <strong>Direct Connection Test:</strong> {directTest.success ? ' Success' : ' Failed'}
            {directTest.data && (
              <pre className="mt-2 small">{JSON.stringify(directTest.data, null, 2)}</pre>
            )}
            {directTest.error && (
              <div className="mt-2">Error: {directTest.error}</div>
            )}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default AIDiagnostic;