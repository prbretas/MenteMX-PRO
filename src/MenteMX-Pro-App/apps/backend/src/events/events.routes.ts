import { Router } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { createEventSchema, updateEventSchema } from './events.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * GET /pilots/:id/events
 * Lista eventos do piloto em ordem cronológica decrescente
 */
router.get('/pilots/:id/events', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const events = await db
      .select()
      .from(schema.event)
      .where(eq(schema.event.pilotId, id))
      .orderBy(desc(schema.event.eventDate));

    res.json(events);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /pilots/:id/events
 * Cadastra novo evento
 */
router.post('/pilots/:id/events', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const input = createEventSchema.parse(req.body);
    const now = new Date();

    const [newEvent] = await db
      .insert(schema.event)
      .values({
        pilotId: id,
        name: input.name,
        eventDate: new Date(input.eventDate),
        type: input.type,
        location: input.location || null,
        startPosition: input.startPosition || null,
        holeshot: input.holeshot || null,
        finalPosition: input.finalPosition || null,
        status: input.status,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    res.status(201).json(newEvent);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /pilots/:pilotId/events/:eventId
 * Atualiza evento
 */
router.put('/pilots/:pilotId/events/:eventId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { pilotId, eventId } = req.params;
    if (req.pilotId !== pilotId) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const input = updateEventSchema.parse(req.body);
    const updateData: any = { ...input, updatedAt: new Date() };
    if (input.eventDate) updateData.eventDate = new Date(input.eventDate);

    const [updated] = await db
      .update(schema.event)
      .set(updateData)
      .where(and(eq(schema.event.id, eventId), eq(schema.event.pilotId, pilotId)))
      .returning();

    if (!updated) { res.status(404).json({ error: 'Evento não encontrado' }); return; }
    res.json(updated);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
