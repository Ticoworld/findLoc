import express from 'express';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Simple admin check: only allow ADMIN_EMAIL from env
/* global process */
function requireAdmin(req, res, next) {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) return next();
  return res.status(403).json({ error: 'Admin only' });
}

// List all users (admin only)
router.get('/', requireAuth, requireAdmin, async (_req, res) => {
  const users = await User.find({}).select('-passwordHash -emailVerificationToken -passwordResetToken').lean();
  return res.json(users);
});

// Verify a user (admin only)
router.post('/verify', requireAuth, requireAdmin, async (req, res) => {
  const { userId } = req.body || {};
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.emailVerified = true;
  await user.save();
  return res.json({ ok: true });
});

export default router;
