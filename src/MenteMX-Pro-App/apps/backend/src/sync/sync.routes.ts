import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { syncBatchSchema } from './sync.schema.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

/**
 * POST /sync/batch
 * Recebe operações pendentes do mobile e aplica no servidor.
 * Retorna IDs confirmados para marcar como synced no cliente.
 */
router.post('/sync/batch', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const input = syncBatchSchema.parse(req.body);
    const confirmedIds: string[] = [];
    const errors: Array<{ id: string; error: string }> = [];

    for (const op of input.operations) {
      try {
        // Registrar operação no servidor
        await db
          .insert(schema.pendingOperation)
          .values({
            id: op.id,
            deviceId: op.deviceId,
            opType: op.opType,
            tableName: op.tableName,
            recordId: op.recordId,
            payload: op.payload,
            createdAt: new Date(op.createdAt),
            synced: true, // já está no servidor
          })
          .onConflictDoNothing();

        confirmedIds.push(op.id);
      } catch (err: any) {
        errors.push({ id: op.id, error: err.message || 'Erro ao processar operação' });
      }
    }

    res.json({
      confirmed: confirmedIds,
      errors,
      total: input.operations.length,
      success: confirmedIds.length,
      failed: errors.length,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res.status(400).json({ error: 'Dados inválidos', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

/**
 * GET /sync/status
 * Retorna timestamp da última sincronização do piloto
 */
router.get('/sync/status', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const lastOp = await db
      .select({ createdAt: schema.pendingOperation.createdAt })
      .from(schema.pendingOperation)
      .where(eq(schema.pendingOperation.deviceId, req.pilotId || ''))
      .orderBy(schema.pendingOperation.createdAt)
      .limit(1);

    res.json({
      lastSyncAt: lastOp.length > 0 ? lastOp[0].createdAt : null,
      status: 'ok',
    });
  } catch {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;
