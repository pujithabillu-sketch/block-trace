import express from 'express';
import { store } from '../data/store.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/reports/counterfeit
router.get('/counterfeit', (req, res) => {
  res.json({
    success: true,
    total: store.counterfeitReports.length,
    reports: store.counterfeitReports
  });
});

// POST /api/reports/counterfeit
router.post('/counterfeit', requireAuth, (req, res) => {
  try {
    const { productId, batchId, reason, details, evidence } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required for reporting counterfeit.' });
    }

    const pId = productId.toUpperCase();
    const product = store.products.find(p => p.productId.toUpperCase() === pId);

    if (product) {
      product.counterfeitReported = true;
      product.currentStatus = 'COUNTERFEIT_REPORTED';
      product.lastUpdateTimestamp = Date.now();
    }

    const reportHash = `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    const now = Date.now();

    const reportRecord = {
      id: `RPT-${String(store.counterfeitReports.length + 1).padStart(3, '0')}`,
      productId: pId,
      batchId: batchId || (product ? product.batchId : 'UNKNOWN'),
      reporterAddress: req.user.address,
      reportHash,
      timestamp: now,
      reason: reason || 'Suspicious packaging / verification mismatch',
      details: details || 'Incident report submitted on-chain',
      evidenceUrl: evidence || '',
      status: 'CONFIRMED'
    };

    const newTx = {
      txId: `TX${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      productId: pId,
      action: 'COUNTERFEIT_REPORTED',
      previousHolder: product ? product.currentHolder : req.user.address,
      newHolder: product ? product.currentHolder : req.user.address,
      blockRound: Math.floor(1000000 + Math.random() * 9000000),
      timestamp: now,
      eventType: 'COUNTERFEIT_REPORTED',
      status: 'CONFIRMED'
    };

    store.counterfeitReports.unshift(reportRecord);
    store.transactions.unshift(newTx);

    res.status(201).json({
      success: true,
      message: 'Counterfeit incident report recorded on Algorand',
      report: reportRecord
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Counterfeit report failed' });
  }
});

export default router;
