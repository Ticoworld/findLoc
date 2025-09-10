import express from 'express';
import Route from '../models/Route.js';
import RouteHistory from '../models/RouteHistory.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/history', requireAuth, async (req, res) => {
  const { destination, routeSummary, path } = req.body || {};
  const doc = await RouteHistory.create({ userId: req.user.id, destination, routeSummary, path });
  return res.json({ ok: true, id: doc._id });
});

router.get('/history', requireAuth, async (req, res) => {
  const list = await RouteHistory.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(50).lean();
  return res.json(list);
});

export default router;
