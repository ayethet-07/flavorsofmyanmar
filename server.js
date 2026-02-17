const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================
// DATABASE CONNECTION
// ============================================

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flavorsofmyammer';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('connected', () => {
  console.log('🗄️ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB');
});

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', require('./routes/auth'));
app.use('/api/recipes', require('./routes/recipes'));
app.use('/api/workshops', require('./routes/workshops'));
app.use('/api/ebook', require('./routes/ebook'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api/ingredients', require('./routes/ingredients'));

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  
  res.json({
    status: dbConnected ? '✅ Backend is running' : '⚠️ Backend running but DB disconnected',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnected ? 'Connected' : 'Disconnected',
    uptime: process.uptime()
  });
});

// ROOT ENDPOINT
app.get('/', (req, res) => {
  res.json({
    message: '🍜 Welcome to Flavors of Myanmar API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      recipes: '/api/recipes',
      workshops: '/api/workshops',
      ebook: '/api/ebook',
      videos: '/api/videos',
      ingredients: '/api/ingredients'
    }
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🍜 FLAVORS OF MYANMAR SERVER');
  console.log('='.repeat(60));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: ${mongoURI}`);
  console.log('='.repeat(60) + '\n');
});

process.on('SIGTERM', () => {
  console.log('⚠️ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
