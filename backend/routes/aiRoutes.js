const express = require('express');
const {
  analyzeNote,
  analyzeText,
  getAIStatus
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// AI Analysis routes
router.post('/analyze/note/:id', analyzeNote);
router.post('/analyze/text', analyzeText);
router.get('/status', getAIStatus);
// router.get('/test', testAIConnection);

module.exports = router;