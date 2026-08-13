import express from 'express';
import { store } from '../data/store.js';
import { algorandService } from '../services/algorand.service.js';
import { requireAuth, requireRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/participants
router.get('/', (req, res) => {
  res.json({
    success: true,
    total: store.participants.length,
    participants: store.participants
  });
});

// POST /api/participants/authorize
router.post('/authorize', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const { address, name, organization, role } = req.body;

    if (!address || !name || !role) {
      return res.status(400).json({ success: false, error: 'Address, Name, and Role are required.' });
    }

    const existing = store.participants.find(p => p.address.toLowerCase() === address.toLowerCase());
    if (existing && existing.isAuthorized) {
      return res.status(400).json({ success: false, error: 'Participant address is already authorized.' });
    }

    const algoTx = await algorandService.authorizeParticipantOnChain({ address, name, role });

    const updatedParticipant = {
      address,
      name,
      organization: organization || `${role} Entity`,
      role,
      isAuthorized: true,
      authorizedDate: new Date().toISOString()
    };

    if (existing) {
      Object.assign(existing, updatedParticipant);
    } else {
      store.participants.push(updatedParticipant);
    }

    res.json({
      success: true,
      message: 'Participant successfully authorized on Algorand',
      participant: updatedParticipant,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Authorization failed' });
  }
});

// POST /api/participants/:wallet/revoke
router.post('/:wallet/revoke', requireAuth, requireRole('ADMIN'), async (req, res) => {
  try {
    const wallet = req.params.wallet;
    const participant = store.participants.find(p => p.address.toLowerCase() === wallet.toLowerCase());

    if (!participant) {
      return res.status(404).json({ success: false, error: 'Participant not found in registry' });
    }

    const algoTx = await algorandService.revokeParticipantOnChain({ address: wallet });

    participant.isAuthorized = false;
    participant.role = 'UNAUTHORIZED';

    res.json({
      success: true,
      message: 'Participant authorization revoked on Algorand',
      participant,
      blockchainTx: algoTx
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Revocation failed' });
  }
});

export default router;
