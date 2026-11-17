const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend dev servers and mobile browsers
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Seed Vault API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/seeds', require('./routes/seedRoutes'));
app.use('/api/purchases', require('./routes/purchaseRoutes'));
app.use('/api/borrows', require('./routes/borrowRoutes'));
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/deposits', require('./routes/depositRoutes'));
app.use('/api/garden', require('./routes/gardenRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/points', require('./routes/pointsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` 🌱 SEED VAULT Backend Server Running on Port ${PORT}`);
    console.log(` 📍 API Health: http://localhost:${PORT}/api/health`);
    console.log(` 📦 Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

// Graceful rejection handler
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;

