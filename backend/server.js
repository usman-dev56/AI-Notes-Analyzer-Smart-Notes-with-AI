const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/notes');
const aiRoutes = require('./routes/aiRoutes'); // Import routes after dotenv

// Import error handler
const errorHandler = require('./utils/errorHandler');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'AI Notes Analyzer API is running!',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes); // <-- moved here after app initialization

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
