import express from 'express';
import { store } from '../data/store.js';
import { algorandService } from '../services/algorand.service.js';

const router = express.Router();

// GET /api/blockchain/transactions
router.get('/transactions', (req, res) => {
  const { type, product, wallet, status, page = 1, limit = 50 } = req.query;
  let results = [...store.transactions];

  if (type) {
    results = results.filter(t => t.action === type || t.eventType === type);
  }
  if (product) {
    results = results.filter(t => t.productId.toUpperCase() === product.toString().toUpperCase());
  }
  if (wallet) {
    const w = wallet.toString().toLowerCase();
    results = results.filter(t => t.previousHolder.toLowerCase().includes(w) || t.newHolder.toLowerCase().includes(w));
  }
  if (status) {
    results = results.filter(t => t.status === status);
  }

  const total = results.length;
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = results.slice(startIndex, startIndex + limitNum);

  res.json({
    success: true,
    total,
    page: pageNum,
    limit: limitNum,
    transactions: paginated
  });
});

// GET /api/blockchain/transactions/:txId
router.get('/transactions/:txId', (req, res) => {
  const tx = store.transactions.find(t => t.txId === req.params.txId);
  if (!tx) {
    return res.status(404).json({ success: false, error: `Transaction "${req.params.txId}" not found` });
  }

  res.json({
    success: true,
    transaction: tx
  });
});

// GET /api/blockchain/health
router.get('/health', async (req, res) => {
  const health = await algorandService.getHealth();
  res.json({
    success: true,
    health
  });
});

export default router;
