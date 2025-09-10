/* global process */
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Preferences from '../models/Preferences.js';
import { sendEmail, buildVerifyEmail, buildResetEmail } from '../utils/mailer.js';

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Reg number pattern: YEAR/DEPT/NUMBER e.g., 2021/SC/19294
const REG_RE = /^\d{4}\/[A-Z]{2}\/\d{5}$/;
function normalizeReg(input = '') {
  return String(input).toUpperCase().replace(/\s+/g, '');
}
import crypto from 'crypto';
// No wrapper: call sendEmail directly and let errors surface
// Email verification endpoint
router.post('/send-verification', async (req, res) => {
  const { email } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true }); // Avoid account enumeration
  if (user.emailVerified) return res.json({ ok: true, message: 'Already verified' });
  const token = crypto.randomBytes(24).toString('hex');
  user.emailVerificationToken = token;
  await user.save();
  try {
    await sendEmail({ to: email, ...buildVerifyEmail({ email, token }) });
  } catch (err) {
    console.error('Email send failed:', err?.message || err);
    return res.status(500).json({ error: 'Failed to send verification email' });
  }
  return res.json({ ok: true });
});

router.post('/verify-email', async (req, res) => {
  const { email, token } = req.body || {};
  const user = await User.findOne({ email });
  if (!user || user.emailVerificationToken !== token) return res.status(400).json({ error: 'Invalid token' });
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  return res.json({ ok: true });
});

// Password reset request
router.post('/request-password-reset', async (req, res) => {
  const { email } = req.body || {};
  const user = await User.findOne({ email });
  if (!user) return res.json({ ok: true }); // Avoid account enumeration
  const token = crypto.randomBytes(24).toString('hex');
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 min
  await user.save();
  try {
    await sendEmail({ to: email, ...buildResetEmail({ email, token }) });
  } catch (err) {
    console.error('Email send failed:', err?.message || err);
    return res.status(500).json({ error: 'Failed to send password reset email' });
  }
  return res.json({ ok: true });
});

// Password reset confirm
router.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body || {};
  const user = await User.findOne({ email });
  if (!user || user.passwordResetToken !== token || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Password too short' });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.json({ ok: true });
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, regNumber } = req.body || {};
    if (!EMAIL_RE.test(email || '')) return res.status(400).json({ error: 'Invalid email' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password too short' });
    const normReg = regNumber ? normalizeReg(regNumber) : undefined;
    if (normReg && !REG_RE.test(normReg)) return res.status(400).json({ error: 'Invalid registration number' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    if (normReg) {
      const existingReg = await User.findOne({ regNumber: normReg });
      if (existingReg) return res.status(409).json({ error: 'Registration number already in use' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    // create user and set verification token
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const user = await User.create({ email, passwordHash, displayName, regNumber: normReg, emailVerificationToken: verificationToken });
    await Preferences.create({ userId: user._id });
    // send verification email (non-blocking)
    sendEmail({ to: email, ...buildVerifyEmail({ email, token: verificationToken }) })
      .catch(err => console.error('Email send failed:', err?.message || err));
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { emailOrReg, email, regNumber, password } = req.body || {};
  const identifier = emailOrReg || email || regNumber;
    if (!identifier) return res.status(400).json({ error: 'Missing login identifier' });
    // Try matching either by email or regNumber
  const query = EMAIL_RE.test(identifier) ? { email: identifier } : { regNumber: normalizeReg(identifier) };
    const user = await User.findOne(query);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, email: user.email, displayName: user.displayName, regNumber: user.regNumber, emailVerified: !!user.emailVerified } });
  } catch {
    return res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
