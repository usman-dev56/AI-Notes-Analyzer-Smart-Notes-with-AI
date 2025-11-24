const express = require('express');
const { body } = require('express-validator');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
  getDashboardStats
} = require('../controllers/noteController');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const noteValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 10000 })
    .withMessage('Content cannot exceed 10000 characters'),
  body('category')
    .optional()
    .isIn(['Study', 'Work', 'Personal'])
    .withMessage('Category must be Study, Work, or Personal')
];

// All routes are protected
router.use(protect);

// Routes
router.get('/', getNotes);
router.get('/dashboard/stats', getDashboardStats);
router.get('/:id', getNote);
router.post('/', noteValidation, handleValidationErrors, createNote);
router.put('/:id', noteValidation, handleValidationErrors, updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);

module.exports = router;