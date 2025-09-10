/* global process */
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from './routes/auth.js';
import graphRouter from './routes/graph.js';
import routesRouter from './routes/routes.js';
import preferencesRouter from './routes/preferences.js';
import usersRouter from './routes/users.js';

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(compression());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME;

if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in environment');
}

mongoose.connect(MONGODB_URI, MONGODB_DB_NAME ? { dbName: MONGODB_DB_NAME } : undefined).then(() => {
  const dbName = mongoose.connection?.name || MONGODB_DB_NAME || '(default)';
  console.log(`MongoDB connected (db: ${dbName})`);
}).catch(() => {
  console.error('MongoDB connection error');
});

app.get('/api/health', (_req, res) => res.json({ ok: true, time: Date.now() }));
app.use('/api/auth', authRouter);
app.use('/api/graph', graphRouter);
app.use('/api/routes', routesRouter);
app.use('/api/preferences', preferencesRouter);
app.use('/api/users', usersRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
