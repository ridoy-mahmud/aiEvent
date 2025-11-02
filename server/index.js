const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables - try .env.local first (for Next.js), then .env
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/init', require('./routes/init'));
app.use('/api/seed-events', require('./routes/seed-events'));

// Debug: Log all registered routes
console.log('✅ Registered API routes:');
console.log('   POST   /api/auth/register');
console.log('   POST   /api/auth/login');
console.log('   POST   /api/auth/google');
console.log('   GET    /api/auth/me (protected)');
console.log('   POST   /api/contacts');
console.log('   GET    /api/contacts (admin)');
console.log('   GET    /api/contacts/:id (admin)');
console.log('   PUT    /api/contacts/:id/read (admin)');
console.log('   DELETE /api/contacts/:id (admin)');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API base URL: http://localhost:${PORT}/api`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

// 404 handler for API routes (must be after all other routes)
// Express 5 doesn't support wildcards like /api/*, so we use a catch-all
app.use((req, res, next) => {
  // Only handle /api routes that haven't been matched
  if (req.path.startsWith('/api')) {
    console.error(`❌ Route not found: ${req.method} ${req.originalUrl}`);
    return res.status(404).json({
      success: false,
      error: `Route ${req.method} ${req.originalUrl} not found`,
    });
  }
  next();
});

// Handle errors in routes
app.use((err, req, res, next) => {
  console.error('❌ Route Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

