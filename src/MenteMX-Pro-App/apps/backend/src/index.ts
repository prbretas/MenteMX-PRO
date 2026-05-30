import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './auth/auth.routes.js';
import bikesRoutes from './bikes/bikes.routes.js';
import sessionsRoutes from './sessions/sessions.routes.js';
import syncRoutes from './sync/sync.routes.js';
import eventsRoutes from './events/events.routes.js';
import setupsRoutes from './setups/setups.routes.js';
import licensingRoutes from './licensing/licensing.routes.js';
import reportsRoutes from './reports/reports.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/', authRoutes); // /pilots/:id routes
app.use('/', bikesRoutes); // /pilots/:id/bikes routes
app.use('/', sessionsRoutes); // /pilots/:id/sessions + /sessions/:id/laps routes
app.use('/sync', syncRoutes); // /sync/batch + /sync/status
app.use('/', eventsRoutes); // /pilots/:id/events
app.use('/', setupsRoutes); // /pilots/:id/setups
app.use('/api/keys', licensingRoutes); // /api/keys/generate, activate, validate
app.use('/', reportsRoutes); // /pilots/:id/reports

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'mentemx-pro-api',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏁 MenteMX Pro API running on port ${PORT}`);
});

export default app;
