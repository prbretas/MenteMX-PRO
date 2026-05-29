import { Router } from 'express';
import { eq, and, asc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { createSessionSchema, addLapSchema, endSessionSchema } from './sessions.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * GET /pilots/:id/sessions
 * Lista sessões do piloto
 */
router.get('/pilots/:id/sessions', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const sessions = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.pilotId, id));

    res.json(sessions);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /pilots/:id/sessions
 * Inicia uma nova sessão
 */
router.post('/pilots/:id/sessions', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const input = createSessionSchema.parse(req.body);
    const now = new Date();

    const [newSession] = await db
      .insert(schema.session)
      .values({
        pilotId: id,
        bikeId: input.bikeId || null,
        eventId: input.eventId || null,
        startedAt: now,
        updatedAt: now,
      })
      .returning();

    res.status(201).json(newSession);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /sessions/:sessionId/laps
 * Registra uma volta na sessão (máximo 2 toques)
 */
router.post('/sessions/:sessionId/laps', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;

    // Verificar que a sessão pertence ao piloto
    const [sessionData] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, sessionId))
      .limit(1);

    if (!sessionData) { res.status(404).json({ error: 'Sessão não encontrada' }); return; }
    if (sessionData.pilotId !== req.pilotId) { res.status(403).json({ error: 'Acesso negado' }); return; }
    if (sessionData.endedAt) { res.status(400).json({ error: 'Sessão já encerrada' }); return; }

    const input = addLapSchema.parse(req.body);

    // Calcular lap_number
    const existingLaps = await db
      .select()
      .from(schema.lap)
      .where(and(eq(schema.lap.sessionId, sessionId), eq(schema.lap.isDeleted, false)));

    const lapNumber = existingLaps.length + 1;

    const [newLap] = await db
      .insert(schema.lap)
      .values({
        sessionId,
        lapNumber,
        lapTimeMs: input.lapTimeMs,
        recordedAt: new Date(),
      })
      .returning();

    // Atualizar contagem na sessão
    await db
      .update(schema.session)
      .set({ lapCount: lapNumber, updatedAt: new Date() })
      .where(eq(schema.session.id, sessionId));

    res.status(201).json(newLap);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /sessions/:sessionId/laps
 * Lista voltas de uma sessão
 */
router.get('/sessions/:sessionId/laps', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;

    const [sessionData] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, sessionId))
      .limit(1);

    if (!sessionData) { res.status(404).json({ error: 'Sessão não encontrada' }); return; }
    if (sessionData.pilotId !== req.pilotId) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const laps = await db
      .select()
      .from(schema.lap)
      .where(and(eq(schema.lap.sessionId, sessionId), eq(schema.lap.isDeleted, false)))
      .orderBy(asc(schema.lap.lapNumber));

    res.json(laps);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /sessions/:sessionId/end
 * Encerra sessão e calcula resumo
 */
router.post('/sessions/:sessionId/end', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { sessionId } = req.params;

    const [sessionData] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, sessionId))
      .limit(1);

    if (!sessionData) { res.status(404).json({ error: 'Sessão não encontrada' }); return; }
    if (sessionData.pilotId !== req.pilotId) { res.status(403).json({ error: 'Acesso negado' }); return; }
    if (sessionData.endedAt) { res.status(400).json({ error: 'Sessão já encerrada' }); return; }

    const input = endSessionSchema.parse(req.body || {});

    // Buscar voltas ativas
    const laps = await db
      .select()
      .from(schema.lap)
      .where(and(eq(schema.lap.sessionId, sessionId), eq(schema.lap.isDeleted, false)));

    const lapTimes = laps.map(l => l.lapTimeMs);
    const lapCount = lapTimes.length;
    const bestLapMs = lapCount > 0 ? Math.min(...lapTimes) : null;
    const avgLapMs = lapCount > 0 ? lapTimes.reduce((a, b) => a + b, 0) / lapCount : null;

    // Calcular consistência (requer >= 3 voltas)
    let consistencyIndex: number | null = null;
    if (lapCount >= 3 && avgLapMs) {
      const mean = avgLapMs;
      const variance = lapTimes.reduce((sum, t) => sum + Math.pow(t - mean, 2), 0) / (lapCount - 1);
      const stdDev = Math.sqrt(variance);
      const cv = stdDev / mean;
      const k = 10; // fator de calibração
      consistencyIndex = Math.max(0, 100 * (1 - cv * k));
    }

    const now = new Date();
    const [updated] = await db
      .update(schema.session)
      .set({
        endedAt: now,
        updatedAt: now,
        lapCount,
        bestLapMs,
        avgLapMs,
        consistencyIndex,
        mentalScore: input.mentalScore || null,
        physicalScore: input.physicalScore || null,
      })
      .where(eq(schema.session.id, sessionId))
      .returning();

    res.json({
      ...updated,
      summary: {
        lapCount,
        bestLapMs,
        avgLapMs: avgLapMs ? Math.round(avgLapMs) : null,
        consistencyIndex: consistencyIndex !== null ? Math.round(consistencyIndex * 10) / 10 : null,
        message: lapCount < 3 ? 'Consistência indisponível - mínimo de 3 voltas necessário' : undefined,
      },
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
