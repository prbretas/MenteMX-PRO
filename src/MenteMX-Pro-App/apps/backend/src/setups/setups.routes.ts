import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { createSetupSchema, updateSetupSchema } from './setups.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * GET /pilots/:id/setups
 * Lista setups do piloto
 */
router.get('/pilots/:id/setups', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const setups = await db
      .select()
      .from(schema.setup)
      .where(eq(schema.setup.pilotId, id));

    res.json(setups);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /pilots/:id/setups
 * Cadastra novo setup
 */
router.post('/pilots/:id/setups', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (req.pilotId !== id) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const input = createSetupSchema.parse(req.body);
    const now = new Date();

    const [newSetup] = await db
      .insert(schema.setup)
      .values({
        pilotId: id,
        bikeId: input.bikeId || null,
        terrain: input.terrain,
        frontCompressionClicks: input.frontCompressionClicks || null,
        frontReboundClicks: input.frontReboundClicks || null,
        rearCompressionClicks: input.rearCompressionClicks || null,
        rearReboundClicks: input.rearReboundClicks || null,
        rearLinkHeightMm: input.rearLinkHeightMm || null,
        frontTirePressure: input.frontTirePressure || null,
        rearTirePressure: input.rearTirePressure || null,
        tireBrandModel: input.tireBrandModel || null,
        notes: input.notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    res.status(201).json(newSetup);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /pilots/:pilotId/setups/:setupId/duplicate
 * Duplica um setup existente
 */
router.post('/pilots/:pilotId/setups/:setupId/duplicate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { pilotId, setupId } = req.params;
    if (req.pilotId !== pilotId) { res.status(403).json({ error: 'Acesso negado' }); return; }

    const [original] = await db
      .select()
      .from(schema.setup)
      .where(and(eq(schema.setup.id, setupId), eq(schema.setup.pilotId, pilotId)))
      .limit(1);

    if (!original) { res.status(404).json({ error: 'Setup não encontrado' }); return; }

    const now = new Date();
    const { id: _, createdAt: __, updatedAt: ___, ...data } = original;

    const [duplicate] = await db
      .insert(schema.setup)
      .values({ ...data, createdAt: now, updatedAt: now })
      .returning();

    res.status(201).json(duplicate);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
