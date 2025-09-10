import express from 'express';
import Node from '../models/Node.js';
import Edge from '../models/Edge.js';
import { requireAuth } from '../middleware/auth.js';
import { sendEmail, buildAdminGraphNotice } from '../utils/mailer.js';
/* global process */
function requireAdmin(req, res, next) {
  if (req.user && req.user.email === process.env.ADMIN_EMAIL) return next();
  return res.status(403).json({ error: 'Admin only' });
}

const router = express.Router();

router.get('/', requireAuth, async (_req, res) => {
  const nodes = await Node.find({}).lean();
  const edges = await Edge.find({}).lean();
  return res.json({ nodes, edges });
});

router.post('/nodes', requireAuth, requireAdmin, async (req, res) => {
  const { nodeId, name, lat, lng, type, metadata } = req.body || {};
  if (!nodeId || typeof lat !== 'number' || typeof lng !== 'number') {
    return res.status(400).json({ error: 'Invalid node' });
  }
  const doc = await Node.findOneAndUpdate({ nodeId }, { nodeId, name, lat, lng, type, metadata }, { upsert: true, new: true });
  // fire-and-forget admin notification
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { subject, text, html } = buildAdminGraphNotice({ actorEmail: req.user?.email, changed: `Node upsert: ${nodeId}` });
      await sendEmail({ to: adminEmail, subject, text, html });
    }
  } catch (e) {
    console.error('Admin graph notice failed:', e?.message || e);
  }
  return res.json(doc);
});

router.post('/edges', requireAuth, requireAdmin, async (req, res) => {
  const { edgeId, from, to, bidirectional = true, weightMeters, attributes } = req.body || {};
  if (!edgeId || !from || !to) return res.status(400).json({ error: 'Invalid edge' });
  const doc = await Edge.findOneAndUpdate({ edgeId }, { edgeId, from, to, bidirectional, weightMeters, attributes }, { upsert: true, new: true });
  // fire-and-forget admin notification
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const { subject, text, html } = buildAdminGraphNotice({ actorEmail: req.user?.email, changed: `Edge upsert: ${edgeId} (${from} -> ${to})` });
      await sendEmail({ to: adminEmail, subject, text, html });
    }
  } catch (e) {
    console.error('Admin graph notice failed:', e?.message || e);
  }
  return res.json(doc);
});

export default router;
