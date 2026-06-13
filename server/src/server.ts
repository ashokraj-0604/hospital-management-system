import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import tenantRoutes from './routes/tenant';

const app: Application = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tenants', tenantRoutes);

// ── Error Handler ─────────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`\n✓ HMS Backend Server running on http://localhost:${PORT}`);
  console.log(`  Environment: ${config.env}`);
  console.log(`  API Base: http://localhost:${PORT}/api/v1`);
  console.log(`\n✓ Test the login endpoint:`);
  console.log(`  POST http://localhost:${PORT}/api/v1/auth/login`);
  console.log(`  Body: {"email":"admin@hospital.com", "password":"Admin@1234"}\n`);
});

export default app;
