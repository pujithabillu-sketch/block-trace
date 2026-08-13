import express from 'express';
import { store } from '../data/store.js';
import { algorandService } from '../services/algorand.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  const { status, manufacturer, batch, owner, search, page = 1, limit = 50 } = req.query;
  let results = [...store.products];

  if (status) {
    results = results.filter(p => p.currentStatus === status);
  }
  if (manufacturer) {
    results = results.filter(p => p.manufacturer.toLowerCase() === manufacturer.toLowerCase());
  }
  if (batch) {
    results = results.filter(p => p.batchId.toUpperCase() === batch.toUpperCase());
  }
  if (owner) {
    results = results.filter(p => p.currentHolder.toLowerCase() === owner.toLowerCase());
  }
  if (search) {
    const q = search.toString().toLowerCase();
    results = results.filter(
      p =>
        p.productId.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.batchId.toLowerCase().includes(q) ||
        p.currentHolder.toLowerCase().includes(q)
    );
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
    totalPages: Math.ceil(total / limitNum),
    products: paginated
  });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const pId = req.params.id.toUpperCase();
  const product = store.products.find(p => p.productId.toUpperCase() === pId);

  if (!product) {
    return res.status(404).json({ success: false, error: `Product ID "${pId}" not found` });
  }

  const history = store.transactions.filter(t => t.productId.toUpperCase() === pId);
  const recallInfo = store.recalls.find(r => r.productId.toUpperCase() === pId);
  const counterfeitInfo = store.counterfeitReports.filter(r => r.productId.toUpperCase() === pId);

  res.json({
    success: true,
    product,
    history,
    recallInfo,
    counterfeitInfo
  });
});

// POST /api/products (Register Product)
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      sku,
      batchId,
      category,
      manufacturer,
      mfgDate,
      expiryDate,
      quantity,
      unit,
      description
    } = req.body;

    if (!name || !batchId) {
      return res.status(400).json({ success: false, error: 'Product Name and Batch ID are required fields.' });
    }

    const productId = `PROD-${Math.floor(100000 + Math.random() * 900000)}`;
    const mfgAddr = manufacturer || req.user.address;
    const metadataHash = `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    // Call Algorand service
    const algoTx = await algorandService.registerProductOnChain({
      productId,
      batchId,
      metadataHash,
      manufacturerAddress: mfgAddr
    });

    const now = Date.now();
    const newProduct = {
      productId,
      name,
      sku: sku || `SKU-${Math.floor(100 + Math.random() * 900)}`,
      batchId: batchId.toUpperCase(),
      category: category || 'General',
      manufacturer: mfgAddr,
      currentHolder: mfgAddr,
      pendingRecipient: '',
      mfgDate: mfgDate || new Date().toISOString().split('T')[0],
      expiryDate: expiryDate || new Date(now + 1000 * 60 * 60 * 24 * 365).toISOString().split('T')[0],
      quantity: quantity ? parseInt(quantity, 10) : 100,
      unit: unit || 'Units',
      description: description || 'Registered via BlockTrace Web3 Platform',
      metadataHash,
      assetId: algoTx.assetId,
      creationTimestamp: now,
      lastUpdateTimestamp: now,
      currentStatus: 'REGISTERED',
      recalled: false,
      counterfeitReported: false
    };

    const newTx = {
      txId: algoTx.txId,
      productId,
      action: 'PRODUCT_REGISTERED',
      previousHolder: mfgAddr,
      newHolder: mfgAddr,
      blockRound: algoTx.round,
      timestamp: now,
      eventType: 'PRODUCT_REGISTERED',
      status: 'CONFIRMED'
    };

    store.products.unshift(newProduct);
    store.transactions.unshift(newTx);

    res.status(201).json({
      success: true,
      message: 'Product successfully registered on Algorand',
      product: newProduct,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Product registration failed' });
  }
});

// POST /api/products/:id/transfer
router.post('/:id/transfer', requireAuth, async (req, res) => {
  try {
    const pId = req.params.id.toUpperCase();
    const { toWallet, recipientRole, transferReason, quantity } = req.body;

    const product = store.products.find(p => p.productId.toUpperCase() === pId);
    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID "${pId}" not found` });
    }

    if (product.recalled) {
      return res.status(400).json({ success: false, error: 'Cannot transfer recalled product. Locked on-chain.' });
    }
    if (product.counterfeitReported) {
      return res.status(400).json({ success: false, error: 'Cannot transfer counterfeit-reported product.' });
    }

    if (!toWallet) {
      return res.status(400).json({ success: false, error: 'Recipient wallet address is required.' });
    }

    const algoTx = await algorandService.transferProductOnChain({
      productId: pId,
      fromAddress: product.currentHolder,
      toAddress: toWallet,
      recipientRole: recipientRole || 'DISTRIBUTOR'
    });

    const now = Date.now();
    product.currentStatus = 'IN_TRANSIT';
    product.pendingRecipient = toWallet;
    product.pendingRecipientRole = recipientRole || 'DISTRIBUTOR';
    product.lastUpdateTimestamp = now;

    const newTx = {
      txId: algoTx.txId,
      productId: pId,
      action: 'PRODUCT_TRANSFERRED',
      previousHolder: product.currentHolder,
      newHolder: toWallet,
      blockRound: algoTx.round,
      timestamp: now,
      eventType: 'TRANSFER_INITIATED',
      status: 'CONFIRMED'
    };

    store.transactions.unshift(newTx);

    res.json({
      success: true,
      message: 'Product transfer initiated on Algorand',
      product,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Transfer failed' });
  }
});

// POST /api/products/:id/receive
router.post('/:id/receive', requireAuth, async (req, res) => {
  try {
    const pId = req.params.id.toUpperCase();
    const { receiverWallet, notes } = req.body;
    const recipientAddr = receiverWallet || req.user.address;

    const product = store.products.find(p => p.productId.toUpperCase() === pId);
    if (!product) {
      return res.status(404).json({ success: false, error: `Product ID "${pId}" not found` });
    }

    if (
      product.pendingRecipient &&
      product.pendingRecipient.toLowerCase() !== recipientAddr.toLowerCase() &&
      req.user.role !== 'ADMIN'
    ) {
      return res.status(403).json({
        success: false,
        error: `Smart Contract Rejection: Caller ${recipientAddr.substring(0, 8)}... is not expected recipient (${product.pendingRecipient.substring(0, 8)}...)`
      });
    }

    const algoTx = await algorandService.receiveProductOnChain({
      productId: pId,
      recipientAddress: recipientAddr
    });

    const now = Date.now();
    let nextStatus = 'AT_DISTRIBUTOR';
    const role = product.pendingRecipientRole || req.user.role;
    if (role === 'WAREHOUSE') nextStatus = 'AT_WAREHOUSE';
    else if (role === 'RETAILER') nextStatus = 'AT_RETAILER';
    else nextStatus = 'AT_DISTRIBUTOR';

    product.previousHolder = product.currentHolder;
    product.currentHolder = recipientAddr;
    product.pendingRecipient = '';
    product.pendingRecipientRole = undefined;
    product.currentStatus = nextStatus;
    product.lastUpdateTimestamp = now;

    const newTx = {
      txId: algoTx.txId,
      productId: pId,
      action: 'PRODUCT_RECEIVED',
      previousHolder: product.previousHolder,
      newHolder: recipientAddr,
      blockRound: algoTx.round,
      timestamp: now,
      eventType: 'RECEIPT_CONFIRMED',
      status: 'CONFIRMED'
    };

    store.transactions.unshift(newTx);

    res.json({
      success: true,
      message: 'Product receipt confirmed on Algorand',
      product,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Receive product failed' });
  }
});

// GET /api/products/:id/history
router.get('/:id/history', (req, res) => {
  const pId = req.params.id.toUpperCase();
  const history = store.transactions.filter(t => t.productId.toUpperCase() === pId);
  res.json({
    success: true,
    productId: pId,
    history
  });
});

export default router;
