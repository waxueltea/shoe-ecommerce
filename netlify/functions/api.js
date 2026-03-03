const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('../../backend/routes/auth');
const productRoutes = require('../../backend/routes/products');
const cartRoutes = require('../../backend/routes/cart');
const orderRoutes = require('../../backend/routes/orders');
const userRoutes = require('../../backend/routes/user');
const generalRoutes = require('../../backend/routes/general');
const errorHandler = require('../../backend/middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api', generalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Export handler for Netlify
exports.handler = serverless(app);
