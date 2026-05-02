import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import reservationRoutes from './routes/reservations.js';
import dashboardRoutes from './routes/dashboard.js';
import settingsRoutes from './routes/settings.js';
import customerRoutes from './routes/customers.js';
import alertRoutes from './routes/alerts.js';
import authRoutes from './routes/auth.js';
import { authenticateToken } from './middleware/auth.js';
import { registerPaymentRoutes } from './routes/payments.js';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const paymentRouter = registerPaymentRoutes(prisma);

// Attach prisma to request for use in routes
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// ─── Routes ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/alerts', authenticateToken, alertRoutes);
app.use('/api/payments', paymentRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Start ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌹 ROSÉ API running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
