import express from 'express';
import Preferences from '../models/Preferences.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    let prefs = await Preferences.findOne({ userId: req.user.id });
    if (!prefs) {
      // Create default preferences
      prefs = await Preferences.create({ userId: req.user.id });
    }
    return res.json({
      avoidDirt: prefs.avoidDirt,
      preferLit: prefs.preferLit,
      avoidStairs: prefs.avoidStairs,
      speedMetersPerMin: prefs.speedMetersPerMin
    });
  } catch {
    return res.status(500).json({ error: 'Failed to get preferences' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { avoidDirt, preferLit, avoidStairs, speedMetersPerMin } = req.body || {};
    
    const prefs = await Preferences.findOneAndUpdate(
      { userId: req.user.id },
      { 
        avoidDirt: !!avoidDirt,
        preferLit: !!preferLit,
        avoidStairs: !!avoidStairs,
        speedMetersPerMin: Math.max(50, Math.min(150, speedMetersPerMin || 80))
      },
      { upsert: true, new: true }
    );
    
    return res.json({
      avoidDirt: prefs.avoidDirt,
      preferLit: prefs.preferLit,
      avoidStairs: prefs.avoidStairs,
      speedMetersPerMin: prefs.speedMetersPerMin
    });
  } catch {
    return res.status(500).json({ error: 'Failed to save preferences' });
  }
});

export default router;
