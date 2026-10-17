require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Database initialization
const db = require('./db/database');
const seedDatabase = require('./db/seed');

// Run auto-seed if needed
try {
  const jobCount = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  if (jobCount < 50) {
    seedDatabase();
  }
} catch (e) {
  console.error('Seed verification error:', e);
}

// Routes
const authRoutes = require('./routes/auth.routes');
const jobsRoutes = require('./routes/jobs.routes');
const savedRoutes = require('./routes/saved.routes');
const collectionsRoutes = require('./routes/collections.routes');
const applicationsRoutes = require('./routes/applications.routes');
const profileRoutes = require('./routes/profile.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const careerRoutes = require('./routes/career.routes');
const resumesRoutes = require('./routes/resumes.routes');
const interviewRoutes = require('./routes/interview.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check (always public)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'CareerFlow API',
    timestamp: new Date().toISOString()
  });
});

// Rate Limiting for Auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.'
  }
});

// Mount Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/collections', collectionsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/resumes', resumesRoutes);
app.use('/api/interviews', interviewRoutes);

// Centralized error handling
app.use(errorHandler);

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found.`
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 CareerFlow Server running on http://localhost:${PORT}`);
    console.log(`   Connected to SQLite database at server/data/careerflow.db`);
    console.log(`   CORS enabled for ${CLIENT_URL}`);
  });
}

module.exports = app;
