import express from 'express';
import cors from 'cors';
import { config } from './config.js';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import productsRoutes from './routes/products.routes.js';
import participantsRoutes from './routes/participants.routes.js';
import blockchainRoutes from './routes/blockchain.routes.js';
import recallsRoutes from './routes/recalls.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import verifyRoutes from './routes/verify.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'BlockTrace Backend REST API',
    version: '1.0.0',
    network: config.network,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/participants', participantsRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/recalls', recallsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/verify', verifyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`==================================================`);
  console.log(`⚡ BlockTrace Backend Server running on port ${config.port}`);
  console.log(`🌐 Algorand Target Network: ${config.network}`);
  console.log(`==================================================`);
});
