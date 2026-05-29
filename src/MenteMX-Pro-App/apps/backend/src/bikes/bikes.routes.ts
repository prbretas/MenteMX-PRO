import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { createBikeSchema, updateBikeSchema } from './bikes.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * GET /pilots/:id/bikes
 * Lista todas as motos do piloto
 */
router.get('/pilots/:id/bikes', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    if (req.pilotId !== id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const bikes = await db
      .select()
      .from(schema.bike)
      .where(eq(schema.bike.pilotId, id));

    res.json(bikes);
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * POST /pilots/:id/bikes
 * Cadastra uma nova moto
 */
router.post('/pilots/:id/bikes', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    if (req.pilotId !== id) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const input = createBikeSchema.parse(req.body);

    const [newBike] = await db
      .insert(schema.bike)
      .values({
        pilotId: id,
        brand: input.brand,
        model: input.model,
        year: input.year,
        displacementCc: input.displacementCc,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    res.status(201).json(newBike);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * PUT /pilots/:pilotId/bikes/:bikeId
 * Atualiza uma moto existente
 */
router.put('/pilots/:pilotId/bikes/:bikeId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { pilotId, bikeId } = req.params;

    if (req.pilotId !== pilotId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const input = updateBikeSchema.parse(req.body);

    const [updated] = await db
      .update(schema.bike)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(schema.bike.id, bikeId), eq(schema.bike.pilotId, pilotId)))
      .returning();

    if (!updated) {
      res.status(404).json({ error: 'Moto não encontrada' });
      return;
    }

    res.json(updated);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * DELETE /pilots/:pilotId/bikes/:bikeId
 * Remove uma moto
 */
router.delete('/pilots/:pilotId/bikes/:bikeId', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const { pilotId, bikeId } = req.params;

    if (req.pilotId !== pilotId) {
      res.status(403).json({ error: 'Acesso negado' });
      return;
    }

    const [deleted] = await db
      .delete(schema.bike)
      .where(and(eq(schema.bike.id, bikeId), eq(schema.bike.pilotId, pilotId)))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: 'Moto não encontrada' });
      return;
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
