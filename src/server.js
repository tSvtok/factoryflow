require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  `mongodb://${process.env.MONGO_HOST || 'mongodb'}:${process.env.MONGO_PORT || 27017}/${process.env.MONGO_DATABASE || 'factoryflow'}`;

// Minimal MongoDB connection
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to: ${MONGO_URI}`);
  })
  .catch((err) => {
    console.error('[MongoDB] Connection error:', err.message);
  });

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from database');
});

// Minimal health check endpoint to verify Docker, Express, and MongoDB connectivity
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'ok',
    service: 'FactoryFlow API',
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[FactoryFlow] Server listening on port ${PORT}`);
  console.log(`[FactoryFlow] Health check available at: http://localhost:${PORT}/api/health`);
});

// Handle graceful shutdown
const gracefulShutdown = () => {
  console.log('[FactoryFlow] Gracefully shutting down...');
  server.close(async () => {
    await mongoose.connection.close(false);
    console.log('[FactoryFlow] Server and MongoDB connection closed');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
