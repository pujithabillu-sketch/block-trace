import express from 'express';
import { store } from '../data/store.js';
import { generateToken } from '../utils/jwt.utils.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { role, address } = req.body;

  let user = store.users.find(u => u.role === role);
  if (address) {
    const match = store.users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (match) user = match;
  }

  if (!user) {
    user = {
      id: `USR-${Date.now()}`,
      address: address || 'MNF4K8L9M0N1P2Q3R4S5T6U7V8W9X0Y1Z2A3B4',
      name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
      email: `${role.toLowerCase()}@blocktrace.io`,
      role: role || 'MANUFACTURER',
      balanceAlgo: 500.0
    };
  }

  const token = generateToken({
    id: user.id,
    address: user.address,
    name: user.name,
    role: user.role
  });

  res.json({
    success: true,
    token,
    user
  });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  const user = store.users.find(u => u.address.toLowerCase() === req.user.address.toLowerCase()) || req.user;
  res.json({
    success: true,
    user
  });
});

export default router;
