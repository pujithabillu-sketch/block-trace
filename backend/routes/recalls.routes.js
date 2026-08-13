import express from 'express';
import { store } from '../data/store.js';
import { algorandService } from '../services/algorand.service.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/recalls
router.get('/', (req, res) => {
  res.json({
    success: true,
    total: store.recalls.length,
    recalls: store.recalls
  });
});

// POST /api/recalls
router.post('/', requireAuth, requireRole('ADMIN', 'MANUFACTURER'), async (req, res) => {
  try {
    const { productId, batchId, reason, severity } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required for emergency recall.' });
    }

    const pId = productId.toUpperCase();
    const product = store.products.find(p => p.productId.toUpperCase() === pId);

    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID "${pId}" not found` });
    }

    if (product.recalled) {
      return res.status(400).json({ success: false, error: `Product "${pId}" is already recalled on-chain.` });
    }

    const algoTx = await algorandService.recordRecallOnChain({
      productId: pId,
      recallReason: reason || 'Emergency safety recall',
      callerAddress: req.user.address
    });

    const now = Date.now();
    product.recalled = true;
    product.currentStatus = 'RECALLED';
    product.lastUpdateTimestamp = now;

    const recallRecord = {
      id: `RCL-${String(store.recalls.length + 1).padStart(3, '0')}`,
      productId: pId,
      batchId: batchId || product.batchId,
      manufacturer: product.manufacturer,
      currentHolder: product.currentHolder,
      recalledAt: now,
      recalledBy: req.user.address,
      reason: reason || 'Safety recall declared on Algorand blockchain',
      severity: severity || 'HIGH',
      status: 'RECALLED'
    };

    const newTx = {
      txId: algoTx.txId,
      productId: pId,
      action: 'PRODUCT_RECALLED',
      previousHolder: product.currentHolder,
      newHolder: product.currentHolder,
      blockRound: algoTx.round,
      timestamp: now,
      eventType: 'PRODUCT_RECALLED',
      status: 'CONFIRMED'
    };

    store.recalls.unshift(recallRecord);
    store.transactions.unshift(newTx);

    res.status(201).json({
      success: true,
      message: 'Product emergency recall recorded on Algorand',
      recall: recallRecord,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Recall processing failed' });
  }
});

export default router;
