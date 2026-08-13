import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/dashboard
router.get('/', (req, res) => {
  const stats = store.getDashboardStats();
  const charts = store.getDashboardCharts();
  const recentActivity = store.transactions.slice(0, 10);

  res.json({
    success: true,
    stats,
    charts,
    recentActivity
  });
});

export default router;
