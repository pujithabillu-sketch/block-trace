import express from 'express';
import { store } from '../data/store.js';

const router = express.Router();

// GET /api/verify/:productId
router.get('/:productId', (req, res) => {
  const pId = req.params.productId.toUpperCase();
  const product = store.products.find(p => p.productId.toUpperCase() === pId || p.batchId.toUpperCase() === pId);

  if (!product) {
    return res.status(404).json({
      success: false,
      verificationState: 'NOT_FOUND',
      message: `Product "${pId}" not found in Algorand state store.`
    });
  }

  const history = store.transactions.filter(t => t.productId.toUpperCase() === product.productId.toUpperCase());
  const recall = store.recalls.find(r => r.productId.toUpperCase() === product.productId.toUpperCase());
  const counterfeit = store.counterfeitReports.find(r => r.productId.toUpperCase() === product.productId.toUpperCase());

  let verificationState = 'AUTHENTIC';
  if (product.recalled || recall) {
    verificationState = 'RECALLED';
  } else if (product.counterfeitReported || counterfeit) {
    verificationState = 'SUSPICIOUS';
  }

  res.json({
    success: true,
    verificationState,
    product,
    history,
    recall,
    counterfeit
  });
});

export default router;
