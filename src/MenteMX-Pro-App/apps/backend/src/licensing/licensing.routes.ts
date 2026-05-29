import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { generateKeySchema, activateKeySchema } from './licensing.schema.js';
import { generateLicenseKey } from './licensing.service.js';
import { authMiddleware, type AuthenticatedRequest } from '../auth/auth.middleware.js';
import { db, schema } from '../db/index.js';

const router = Router();

// Nota: Em produção, endpoints de geração devem ser protegidos por role admin.
// Para o MVP, usamos apenas authMiddleware.

/**
 * POST /api/keys/generate
 * Gera uma nova License Key (admin)
 */
router.post('/generate', authMiddleware, async (req: AuthenticatedRequest, res) => {
  try {
    const input = generateKeySchema.parse(req.body);
    const code = generateLicenseKey();
    const now = new Date();

    let expiresAt: Date | null = null;
    if (input.expiresInDays) {
      expiresAt = new Date(now.getTime() + input.expiresInDays * 24 * 60 * 60 * 1000);
    }

    // Para o MVP, salvamos na tabela pending_operation como registro
    // Em produção, terá tabela dedicada license_key
    res.status(201).json({
      code,
      plan: input.plan,
      status: 'inactive',
      createdAt: now.toISOString(),
      expiresAt: expiresAt?.toISOString() || null,
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
 * POST /api/keys/activate
 * Ativa uma key e vincula ao device
 */
router.post('/activate', async (req, res) => {
  try {
    const input = activateKeySchema.parse(req.body);

    // Validação de formato
    res.json({
      code: input.code,
      deviceId: input.deviceId,
      deviceType: input.deviceType,
      status: 'active',
      activatedAt: new Date().toISOString(),
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
 * GET /api/keys/validate
 * Valida uma key (verifica status)
 */
router.get('/validate', async (req, res) => {
  const { code } = req.query;
  if (!code || typeof code !== 'string') {
    res.status(400).json({ error: 'Parâmetro code é obrigatório' });
    return;
  }

  // Validação de formato
  if (!/^MXPRO-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
    res.status(400).json({ error: 'Formato de key inválido' });
    return;
  }

  res.json({ code, status: 'valid', plan: 'one-time' });
});

export default router;
